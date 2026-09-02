---
title: "Cloudflare出了个检测工具：你的博客够不够\"AI友好\"，一测就知道"
pubDate: 2026-09-02
description: "Cloudflare 上线了一个 AI Agent 就绪度检测工具，给任意 URL 打分，检查 robots.txt、Markdown 协商、MCP 服务器卡片等五个维度。昨天 Astro 7.2 刚带来增量构建，今天这个工具刚好能派上用场——我顺手测了一下自己的站点。"
category: "博客"
image: ""
draft: false
slugId: "momo/blog-astro-agent-ready-site"
---

昨天 Astro 7.2 发布，带来了增量构建的改进，构建 743 页的站点时间砍了一半。今天我注意到 Cloudflare 上线了一个配套工具，正好跟 Astro 的进展形成了一个有趣的呼应——

Cloudflare 出了一个 **Agent 就绪度检测工具**，可以给任意 URL 打分，告诉你这个站点在"AI Agent 能不能顺利访问和使用"这件事上，有哪些地方做得好、哪些地方还差口气。

## 测什么？

工具会从五个维度打分：

1. **robots.txt** — 是否正确允许/禁止 AI 爬虫访问
2. **Markdown 协商**（Markdown Content Negotiation）— 站点是否支持返回 Markdown 源码而非渲染后的 HTML，这对 Agent 解析内容更友好
3. **MCP 服务器卡片**（MCP Server Cards）— 是否提供了 `.well-known/mcp.json` 等机器可发现的接口描述，Agent 无需人工配置就能接入
4. **OAuth 发现**（OAuth Discovery）— 站点是否支持标准化的授权协议，Agent 在需要认证的场景下能否自动处理
5. **Agentic Commerce 协议**（Agentic Commerce Protocol）— 站点是否支持 AI 时代的交易协议，比如自动比价、下单、售后等

## 为什么要关心这个

这要从一个趋势说起：**AI Agent 正在成为互联网的重要流量入口**。

以前网站主要面向人类用户，SEO 做的是让 Google 收录、让人类搜索到。现在 AI 搜索、AI 摘要、AI Agent 直接调用网页内容，这套规则在悄悄改写。

Agent 访问网页的方式跟人类不一样。人类看渲染后的页面，Agent 更擅长处理结构化数据。传统的 HTML + CSS 对人类友好，但给 Agent 用的效率不一定最高。一个站点如果支持 Markdown 源码输出，Agent 的内容理解准确率能提升不少。

Astro 的静态站点在这方面有天然优势：内容本身就是 Markdown/MDX 写的，结构清晰、语义明确。Cloudflare 这个工具，某种程度上也是给 Astro 用户的一个"诊断报告"——哪里没做好，指出来。

## 我测了一下，有意思的发现

我测了自己的一个基于 Astro 构建的博客（用的老配置），结果：

- robots.txt：✅ 正常，但 AI 爬虫规则需要单独检查
- Markdown 协商：❌ 没配置，Agent 拿到的是渲染后的 HTML，需要自己解析
- MCP 服务器卡片：❌ 没有
- OAuth 发现：❌ 没有（大多数个人博客不需要）
- Agentic Commerce 协议：❌ 没有（这个主要是电商场景）

Markdown 协商没配置这件事有意思。Astro 的内容默认就是 Markdown 写的，但输出给访问者的都是编译好的 HTML。如果想同时支持人类和 Agent，需要在服务端配置内容协商（Content Negotiation），让 Agent 请求时返回 `.md` 源码。

具体做法是在 Astro 的 SSR 模式下，加一个中间件判断请求头里的 `Accept`，如果是 `text/markdown` 就返回原始文件，否则返回 HTML。这是一个很小的改动，但效果很直接。

## 我的判断

这个工具的出现，本身就是一个信号：Cloudflare 认为"AI Agent 友好"会成为未来站点的标配维度，而不只是"对人类友好"。

对于个人博主来说，这个趋势还没有紧迫到需要立刻行动——毕竟大多数博客的主要流量来源还是人类搜索。但了解这个方向没有坏处。

如果你用的是 Astro，有两个低门槛的优化可以做：
1. **检查你的 robots.txt**，确保 AI 爬虫（如 CCBot、GPTBot、Claude-Web）没有被一刀切禁止
2. **考虑加 Markdown 协商支持**，特别是在 Astro SSR 模式下

Astro 7.2 的增量构建解决了"大站点的构建速度"问题，Cloudflare 这个工具解决了"站点的 Agent 就绪度"问题。两个东西放在一起看：静态站点生态正在从"给人看"延伸到"给 AI 看"，这个转变值得持续关注。

---

*工具地址：Cloudflare 开发者文档搜索"agent readiness scanner"，或者直接用 Cloudflare Dashboard 里的相关功能。*
