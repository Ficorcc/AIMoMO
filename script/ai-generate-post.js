import { mkdir, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const configPath = join(__dirname, 'ai-writer.config.json');

const args = new Set(process.argv.slice(2));
const topicArg = getArg('--topic');
const publish = args.has('--publish');
const push = args.has('--push');
const dryRun = args.has('--dry-run');

if (args.has('--help')) {
    printHelp();
    process.exit(0);
}

const config = JSON.parse(await readFile(configPath, 'utf8'));
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.AI_MODEL || 'gpt-5.5';

if (!apiKey) {
    console.error('Missing OPENAI_API_KEY. Set it before running this script.');
    process.exit(1);
}

const topic = topicArg || await pickTopic(config);
const article = await generateArticle({ config, topic, apiKey, model, publish });
const post = normalizeArticle(article, config, publish);
const targetDir = join(rootDir, config.outputDir, post.slug);
const targetPath = join(targetDir, `${config.language || 'zh-cn'}.md`);

if (existsSync(targetPath)) {
    console.error(`Post already exists: ${targetPath}`);
    process.exit(1);
}

const markdown = toAstroPostMarkdown(post);

if (dryRun) {
    console.log(markdown);
    process.exit(0);
}

await mkdir(targetDir, { recursive: true });
await writeFile(targetPath, markdown, 'utf8');
console.log(`Created ${targetPath}`);

if (publish) {
    run('pnpm', ['posts:normalize']);
    run('pnpm', ['build']);
    run('git', ['add', 'src/content/blog']);
    run('git', ['commit', '-m', `Publish AI article: ${post.title}`]);

    if (push) {
        run('git', ['push']);
        console.log('Pushed to GitHub. Cloudflare Pages will deploy from the connected repository.');
    }
}

function getArg(name) {
    const index = process.argv.indexOf(name);
    if (index === -1) return '';
    return process.argv[index + 1] || '';
}

async function pickTopic(config) {
    const scope = (config.topicScope || []).join('\n- ');
    const prompt = [
        '请从下面的范围里挑一个适合今天写博客的具体选题。',
        '要求：主题足够具体，适合搜索资料后写成个人博客文章。',
        '',
        `范围：\n- ${scope}`,
        '',
        '只返回一个中文标题，不要解释。'
    ].join('\n');

    const text = await callOpenAI({
        apiKey,
        model,
        body: {
            model,
            input: prompt
        }
    });

    return text.trim().replace(/^["“]|["”]$/g, '');
}

async function generateArticle({ config, topic, apiKey, model, publish }) {
    const prompt = [
        `你要为 ${config.siteName} 生成一篇中文 Astro 博客文章。`,
        '',
        `主题：${topic}`,
        `写作风格：${config.authorStyle}`,
        `默认分类：${config.defaultCategory}`,
        `范围：${(config.topicScope || []).join('、')}`,
        `避免：${(config.avoidTopics || []).join('、')}`,
        '',
        '请先用网络搜索核对资料，再生成文章。',
        `文章长度：${config.articleRules?.minWords || 900} 到 ${config.articleRules?.maxWords || 1800} 字。`,
        '正文必须是 Markdown，结尾必须有“参考与延伸阅读”小节，列出你实际使用过的来源链接。',
        '不要编造来源；不确定的内容要写成“可能”“目前看”。',
        '',
        '只返回严格 JSON，不要 Markdown 代码块，不要额外说明。格式：',
        JSON.stringify({
            title: '文章标题',
            description: '80 到 140 字摘要',
            category: config.defaultCategory,
            slug: 'lowercase-url-slug',
            bodyMarkdown: 'Markdown 正文，不包含 frontmatter',
            sources: ['https://example.com']
        }, null, 2),
        '',
        publish
            ? '这篇文章会直接发布，请用更稳妥、克制的表达。'
            : '这篇文章先作为草稿，请保留可供人工微调的细节。'
    ].join('\n');

    const text = await callOpenAI({
        apiKey,
        model,
        body: {
            model,
            input: prompt,
            tools: [{ type: 'web_search_preview' }]
        }
    });

    return JSON.parse(stripJsonFence(text));
}

async function callOpenAI({ apiKey, body }) {
    const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const json = await response.json();

    if (!response.ok) {
        const message = json?.error?.message || response.statusText;
        throw new Error(`OpenAI API error: ${message}`);
    }

    return json.output_text || extractOutputText(json);
}

function extractOutputText(response) {
    return (response.output || [])
        .flatMap((item) => item.content || [])
        .map((content) => content.text || '')
        .join('\n')
        .trim();
}

function normalizeArticle(article, config, publish) {
    const title = String(article.title || '').trim();
    const description = String(article.description || '').trim();
    const bodyMarkdown = String(article.bodyMarkdown || '').trim();
    const category = String(article.category || config.defaultCategory || '指南').trim();
    const slug = toSlug(article.slug || title);
    const sources = Array.isArray(article.sources) ? article.sources.filter(Boolean) : [];

    if (!title || !description || !bodyMarkdown || !slug) {
        throw new Error('Generated article is missing title, description, bodyMarkdown, or slug.');
    }

    return {
        title,
        description,
        category,
        slug,
        bodyMarkdown,
        sources,
        draft: !publish
    };
}

function toAstroPostMarkdown(post) {
    const date = new Date().toISOString().slice(0, 10);
    const sourceComment = post.sources.length
        ? `\n<!-- AI sources:\n${post.sources.map((source) => `- ${source}`).join('\n')}\n-->\n`
        : '\n';

    return [
        '---',
        `title: ${JSON.stringify(post.title)}`,
        `pubDate: ${date}`,
        `description: ${JSON.stringify(post.description)}`,
        `category: ${JSON.stringify(post.category)}`,
        'image: ""',
        `draft: ${post.draft ? 'true' : 'false'}`,
        `slugId: "momo/${post.slug}"`,
        '---',
        sourceComment,
        post.bodyMarkdown,
        ''
    ].join('\n');
}

function toSlug(value) {
    const slug = String(value)
        .normalize('NFKD')
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);

    return slug || `ai-${Date.now()}`;
}

function stripJsonFence(text) {
    return text.trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '');
}

function run(command, commandArgs) {
    console.log(`$ ${command} ${commandArgs.join(' ')}`);
    execFileSync(command, commandArgs, {
        cwd: rootDir,
        stdio: 'inherit'
    });
}

function printHelp() {
    console.log(`
Usage:
  OPENAI_API_KEY=... pnpm ai:post -- --topic "AI 写作工作流"
  OPENAI_API_KEY=... pnpm ai:publish -- --topic "AI 写作工作流"

Options:
  --topic <text>   指定主题；不传时由 AI 从配置范围里挑选
  --publish        生成非草稿，并在成功构建后提交
  --push           搭配 --publish 使用，提交后推送到 GitHub
  --dry-run        只输出 Markdown，不写入文件
  --help           显示帮助
`);
}
