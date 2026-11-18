---
title: "Cloudflare 开始给你的博客准备一个『AI 版本』：Markdown 直接吐出来，但 ETag 没了"
pubDate: 2026-11-18
description: "Cloudflare 的 Markdown for Agents 11 月 9 日正式可用，并配了一整套计量：转化率、失败原因、top user agent、GraphQL 数据集。它用普通 HTTP 内容协商，在边缘把博客的 HTML 变成干净的 Markdown 喂给 AI 智能体。代价也很具体：ETag 和 Last-Modified 掉了，6 MiB 以上静默截断。"
category: "博客"
image: ""
draft: false
slugId: "momo/blog-cloudflare-markdown-for-agents-ga"
---

上周（11 月 9 日），Cloudflare 把 **Markdown for Agents** 从 2 月预告的功能转成了正式可用，同时补上了一层计量。这两天陆续有开发者在拆它的细节，其中最关键的一句是：转化后的响应里，**ETag 和 Last-Modified 被丢掉了**。

这件事对跑在 Cloudflare 上的独立博客，比想象中重要。

## 它到底做了什么

机制非常朴素，就是 HTTP 内容协商。

客户端（AI 智能体、爬虫、你自己的脚本）在 `Accept` 头里写上 `text/markdown`。Cloudflare 拿到请求，回源取 HTML，在边缘把正文转成 Markdown，再流回给客户端。返回的头里 `Content-Type` 变成 `text/markdown`，并且把 `Accept` 加进了 `Vary`——所以缓存会为同一条 URL 保留 HTML 和 Markdown 两份变体。

输出格式是固定的：开头一段 YAML frontmatter，内容取自页面的 meta（标准写法的优先，没有就退到 Open Graph）；导航、页脚、脚本、样式全部剥掉；页面里的 JSON-LD 原样保留，塞在结尾一个代码块里。

固定格式这件事，对"读者"意义很大。以前一个智能体去读一百个博客，得写一百套解析规则；现在它只需要认一种形状。

功能覆盖 Pro、Business、Enterprise 以及 SSL for SaaS，不额外收费；只处理 HTML，解压后超过 6 MiB 就不再转换。

## 新给的那套"计量"，才是重点

我觉得真正改变性质的不是转换，是这次配套的分析层。后台 Agent Readiness 下多了几个东西：

- **Analytics**：7 天窗口内的转换尝试数、完整转换率、部分转换与失败数、转换最多的页面、出现最多的 user agent、失败原因、内容超限情况，以及一个估算的 token 减少量。
- **Logs**：抽样的转换事件，可按结果、失败原因、内容超限筛选。
- **Playground**：给一个路径，直接把 Markdown 版和 HTML 版并排放在一起看，连响应头一起。
- **GraphQL**：数据以 `markdownForAgentsAdaptiveGroups` 出口，zone 级和账号级都能查，7 天历史、单次查询上限 1000 组。
- **Traces**：抽样的流式转换上挂一个 `markdown_conversion` span，带结果、输入输出字节、转换器 CPU 时间、最长处理片段、内容超限标记。

一旦有了这套数据，"要不要让 AI 读我的站"就不再是立场问题，而是工程问题——你能看到有多少请求真的走的是 Markdown、哪些页面转化失败、是哪个 agent 在拿。

## 三个代价，得先说清楚

**第一，条件请求失效。** 安全头和缓存头都会保留（HSTS、CSP、X-Frame-Options、Set-Cookie、CORS、缓存相关都还在），但由响应体派生的那几个头会掉：`Content-Type` 换成 `text/markdown`，`Content-Length` 为了支持流式被移除，`ETag`、`Last-Modified`、`Content-Encoding`、`Content-Range`、`Transfer-Encoding` 一并丢弃——因为它们的值属于原始 HTML。

后果不是"少个头"这么轻。一个智能体拿 `If-None-Match` 轮询你的页面，永远得不到 304，每次都是全量传输；你在监控里看到的请求模式，也会和 HTML 那一侧对不上；如果下游存了 Markdown 想判断"页面变了没"，最便宜的判断依据已经没了，只能自己算内容哈希。

**第二，6 MiB 是静默的。** 这个上限算的是解压后的 HTML。一篇很长的文档页可能悄悄越线，结果智能体收到的是一份能解析、但缺了它本来要找的那一节的文档。Cloudflare 把"完整转换"定义为"没有触发任何内容超限标记"——至于内容保真度如何，那是另一回事。

**第三，token 数是估算。** 官方口径是字节数除以四、向下取整，按抽样加权，且只统计有正输入估算的完整转换。它自己都提醒：当 Markdown 输出比 HTML 输入还大时，这个比值会变成负数。它更适合当带宽代理指标；真要算目标分词器的 token，得自己跑一遍。代码、表格、满屏标识符的页面，偏差最大。

顺便记两个小坑：user agent 分布是客户端自报的，Cloudflare 不验证背后的机器人身份；页面 URL 统计里不含查询串和锚点。

## 我认为

独立博客这些年一直在做同一件事：给不同的"读者"准备不同的表示层。RSS 给阅读器，Open Graph 给社交平台，`sitemap.xml` 给搜索引擎，现在多了第四个——Markdown 给智能体。所以我不觉得这是"又一个 CDN 功能"，它是站点出口标准化的下一步。哪天有读者问 AI"最近谁在写 Typecho 迁移经验"，AI 去读的那几页很可能就是 Markdown 版。你的站能不能进那个答案，取决于机器能不能干净地读懂你。

但也不必慌着开，三个理由：**没开也能被读**（智能体读 HTML 一样读，只是多花 token、多踩导航和页脚的坑，成本在它那边）；**开了就得接受没有 304**（对流量大的站是纯亏，AI 爬虫轮询会变成全量拉取，要开就顺手把 `Cache-Control` 和抓取策略一起想清楚，别只盯"token 减少"那个数字）；**这套计量眼下真正的用法是诊断，不是炫耀**——我最在意的不是转换率，是**部分转换率**：它一涨，就说明有页面对机器来说"只读了一半"，那才是内容结构该改的信号。

Cloudflare 这次真正卖的是一个位置：它把自己放进了"网站和 AI 之间"这条链路中间，然后开始计量。计量的东西，早晚会被定价。这一步走完，独立博客的流量账本里，"人类访问"和"机器访问"大概会正式分成两栏。

分栏这件事，我觉得是好事。至少以后有人问"AI 到底有没有读你"，你不用再猜。
