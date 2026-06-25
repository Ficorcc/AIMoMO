import { mkdir, readFile, readdir, rename, rmdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const blogDir = path.join(rootDir, 'src', 'content', 'blog');
const configPath = path.join(__dirname, 'ai-writer.config.json');
const defaultLanguage = 'zh-cn';
const languages = new Set(['zh-cn', 'en']);
const checkOnly = process.argv.includes('--check');

const config = existsSync(configPath)
  ? JSON.parse(await readFile(configPath, 'utf8'))
  : {};

const changes = [];
const files = await listMarkdownFiles(blogDir);

for (const file of files) {
  const normalizedPath = await normalizeFileLocation(file);
  await normalizeFrontmatter(normalizedPath);
}

if (changes.length) {
  console.log(`Normalized ${changes.length} blog file change(s):`);
  for (const change of changes) {
    console.log(`- ${change}`);
  }
}

if (checkOnly && changes.length) {
  process.exit(1);
}

async function listMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...await listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results.sort();
}

async function normalizeFileLocation(file) {
  const basename = path.basename(file);
  if (languages.has(basename.replace(/\.md$/, ''))) {
    return file;
  }

  const relative = path.relative(blogDir, file);
  const parsed = path.parse(relative);
  const target = path.join(blogDir, parsed.dir, parsed.name, `${defaultLanguage}.md`);

  if (target === file) {
    return file;
  }

  const message = `${toPosix(relative)} -> ${toPosix(path.relative(blogDir, target))}`;
  changes.push(message);

  if (checkOnly) {
    return file;
  }

  if (existsSync(target)) {
    throw new Error(`Cannot normalize ${relative}: target already exists at ${path.relative(rootDir, target)}`);
  }

  await mkdir(path.dirname(target), { recursive: true });
  await rename(file, target);
  await removeEmptyParents(path.dirname(file));

  return target;
}

async function normalizeFrontmatter(file) {
  const original = await readFile(file, 'utf8');
  const { frontmatter, body } = splitFrontmatter(original);
  const data = parseFlatFrontmatter(frontmatter);
  const relative = toPosix(path.relative(blogDir, file));
  const slugPath = getSlugPath(relative);
  const slugLeaf = slugPath.split('/').filter(Boolean).pop() || slugPath || `post-${Date.now()}`;

  const normalized = {
    title: data.title || firstHeading(body) || humanizeSlug(slugLeaf),
    pubDate: normalizeDate(data.pubDate || data.date),
    description: data.description || excerpt(body),
    category: data.category || config.defaultCategory || 'AI',
    image: data.image ?? '',
    draft: normalizeBoolean(data.draft, false),
    slugId: normalizeSlugId(data.slugId || data.slug, slugLeaf),
  };

  const lines = [
    '---',
    `title: ${quote(normalized.title)}`,
    `pubDate: ${normalized.pubDate}`,
    `description: ${quote(normalized.description)}`,
    `category: ${quote(normalized.category)}`,
    `image: ${quote(normalized.image)}`,
    `draft: ${normalized.draft ? 'true' : 'false'}`,
    `slugId: ${quote(normalized.slugId)}`,
  ];

  if (data.pinTop !== undefined && data.pinTop !== '') {
    lines.push(`pinTop: ${Number(data.pinTop) || 0}`);
  }

  lines.push('---', '', body.trimStart());
  const next = `${lines.join('\n').trimEnd()}\n`;

  if (next !== original) {
    changes.push(toPosix(path.relative(rootDir, file)));
    if (!checkOnly) {
      await writeFile(file, next, 'utf8');
    }
  }
}

function splitFrontmatter(markdown) {
  const normalized = markdown.replace(/^\uFEFF/, '');
  if (!normalized.startsWith('---')) {
    return { frontmatter: '', body: normalized };
  }

  const lines = normalized.split(/\r?\n/);
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---');

  if (end === -1) {
    return { frontmatter: '', body: normalized };
  }

  return {
    frontmatter: lines.slice(1, end).join('\n'),
    body: lines.slice(end + 1).join('\n'),
  };
}

function parseFlatFrontmatter(frontmatter) {
  const data = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    data[key] = stripScalar(rawValue);
  }

  return data;
}

function stripScalar(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }

  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }

  return trimmed;
}

function getSlugPath(relative) {
  const parts = relative.split('/');
  const file = parts.at(-1);

  if (file && languages.has(file.replace(/\.md$/, ''))) {
    return parts.slice(0, -1).join('/');
  }

  return relative.replace(/\.md$/, '');
}

function normalizeDate(value) {
  const raw = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/.test(raw)) {
    return raw;
  }

  return new Date().toISOString().slice(0, 10);
}

function normalizeBoolean(value, fallback) {
  if (value === undefined || value === '') return fallback;
  return String(value).trim().toLowerCase() === 'true';
}

function normalizeSlugId(value, fallbackSlug) {
  const raw = String(value || '').trim().replace(/^["']|["']$/g, '');
  if (!raw) return `momo/${fallbackSlug}`;
  if (raw.startsWith('momo/')) return raw;
  return `momo/${raw.replace(/^\/+/, '')}`;
}

function firstHeading(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || '';
}

function excerpt(markdown) {
  const text = markdown
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^#+\s+/gm, '')
    .replace(/[`*_>#\[\]()]/g, '')
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .find(Boolean) || '';

  return text.slice(0, 140);
}

function humanizeSlug(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (char) => char.toUpperCase()) || 'New Post';
}

function quote(value) {
  return JSON.stringify(String(value ?? ''));
}

async function removeEmptyParents(dir) {
  let current = dir;

  while (current.startsWith(blogDir) && current !== blogDir) {
    try {
      await rmdir(current);
      current = path.dirname(current);
    } catch {
      return;
    }
  }
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}
