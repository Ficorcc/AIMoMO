# AI 自动写作与发布

这套脚本用于把“搜索资料、生成文章、写入 Astro、构建检查、提交推送”串起来。当前博客是静态 Astro 站点，Cloudflare Pages 已经连接 GitHub，所以脚本推送到 `main` 后会自动触发部署。

## 配置范围

主题范围在 `script/ai-writer.config.json`：

- `topicScope`：允许搜索和写作的主题范围。
- `avoidTopics`：明确避开的主题。
- `defaultCategory`：生成文章默认分类。
- `outputDir`：生成文章保存位置，默认是 `src/content/blog/ai`。
- `articleRules`：文章长度、来源数量、写作语气等约束。

## 环境变量

不要把密钥写进仓库。运行前在本机设置：

```bash
export OPENAI_API_KEY="你的 API Key"
export AI_MODEL="gpt-5.5"
```

`AI_MODEL` 可以不设置，脚本默认使用 `gpt-5.5`。

## 生成草稿

先生成草稿是最稳的方式：

```bash
pnpm ai:post -- --topic "Astro 博客如何接入 AI 自动写作"
```

生成后的文件会在：

```text
src/content/blog/ai/<slug>/zh-cn.md
```

默认 `draft: true`，不会出现在正式文章列表里。

## 直接发布

确认范围和提示词稳定后，可以使用发布模式：

```bash
pnpm ai:publish -- --topic "Astro 博客如何接入 AI 自动写作"
```

这个命令会：

1. 生成 `draft: false` 的文章。
2. 执行 `pnpm build`。
3. 构建成功后 `git add` 和 `git commit`。
4. `git push` 到 GitHub。
5. 由 Cloudflare Pages 自动部署。

## 自动规范化

仓库现在会在 `pnpm build` 前自动执行：

```bash
pnpm posts:normalize
```

这个步骤会扫描 `src/content/blog/**/*.md`，自动修正常见的 AI 生成问题：

- 把 `date` 转成当前 schema 使用的 `pubDate`。
- 自动补齐 `description`、`category`、`image`、`draft`、`slugId`。
- 安全转义标题和摘要里的引号，避免 YAML frontmatter 解析失败。
- 把 `src/content/blog/foo.md` 这类裸文件移动为 `src/content/blog/foo/zh-cn.md`，保证文章能进入路由并正确显示。

如果 qclaw 直接把文章推到 GitHub，只要 Cloudflare 仍然执行 `pnpm build`，部署前也会自动规范化一次。手动检查可以运行：

```bash
pnpm posts:check
```

如果这个命令失败，说明有文章需要规范化；运行 `pnpm posts:normalize` 后再提交即可。

## 自动定时

后续可以用 GitHub Actions、服务器 cron 或本机定时任务运行 `pnpm ai:publish`。真正打开定时发布前，建议先让脚本至少跑几次草稿模式，确认选题、引用和文风符合博客调性。

## 内容安全

AI 文章容易出现过时信息、弱来源和过度肯定的表达。这个脚本已经要求模型搜索资料并在文章结尾列来源，但最终仍建议保留人工抽查，尤其是涉及健康、法律、金融、实时新闻和人物评价的内容。
