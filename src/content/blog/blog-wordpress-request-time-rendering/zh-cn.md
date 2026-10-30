---
title: "发布一篇文章要重建几千个页面？这位博主给2000篇的WordPress换了个新活法"
pubDate: 2026-10-30
description: "headless WordPress 的经典玩法是『发布即触发全站重建』，但博客一旦上千篇，成本会悄悄失控。10月18日，博主 Varun Dubey 把四个站点迁到 Cloudflare Worker 请求时渲染：不重建、不部署，发布一分钟内上线，还顺手解锁了 llms.txt 和带真实更新日期的 sitemap。这篇文章拆解了他的架构与踩坑。"
category: "博客"
image: ""
draft: false
slugId: "momo/blog-wordpress-request-time-rendering"
---

如果你玩过 headless WordPress，多半见过这套标准姿势：WordPress 存内容，Astro 构建时把每篇文章从 REST API 拉下来，整站生成静态页，发布时用 webhook 触发一次全新构建，几分钟后新文章上线。站点小的时候，这套流程又稳又清晰。但 Varun Dubey 想说的是：它停止好用的那一刻，比你想象中来得早。

10 月 18 日，他把名下四个站点（vapvarun.com、buddyxtheme.com、reigntheme.com、brndle.com）一起切换到了新模式——请求时渲染。博客不再在发布时构建，而是由 Cloudflare Worker 在有人访问的那一刻，从 WordPress 实时渲染，再用 Workers KV 缓存。他在文章里说得很坦诚：这是在纠正自己 4 月写的建议，那篇《WP Astro MCP v3》还推荐“发布即重建”，如今对小站仍然合理，但对文章上千的博客已经不合适了。

为什么撑不住了？三个成本会随着博客长大悄悄失控。第一，构建规模跟着文章数涨：四个站现在各有 586 到 2500 篇文章，姐妹站 wbcomdesigns.com 更是有约 8000 篇——改一个错别字，就要把几千个页面全部重写一遍。第二，发布依赖一条脆弱链条：WordPress 发 webhook、webhook 带 token 触发 CI、CI 构建部署，任何一环断了文章就出不来。9 月 28 日他的 token 过期，三个站点的新文章悄悄消失了好几天，没有任何报错。第三，更新上线慢：修正旧文章、换封面图，都要等一整轮构建。

新模型的关键词是“不重建”。Astro 只构建一次静态部分和两个“壳页面”（空文章页、空列表页），构建过程完全不碰 WordPress。用户请求文章时，Worker 先查 KV 缓存，命中就用壳页填内容直接返回，未命中才去 WordPress REST API 取，存进 KV。列表、分类、搜索、sitemap 全部同理。发布时只做两件事：删掉那篇文章的缓存条目，再更新一个“列表版本号”——因为列表缓存 key 里都嵌着版本号，版本一变，所有依赖文章集合的列表下一次请求全部重新构建，一次写入就完成全部失效，不用挨个去找哪些列表受影响。配合 stale-while-revalidate，文章缓存 6 小时内新鲜、列表 10 分钟，过期了也先回旧数据、后台再刷，读者几乎永远不用等 WordPress。

迁移过程中踩的坑也很有价值：WordPress 前面旧的边缘缓存会把“发布前的旧答案”存上一天，活文章差点变 404，解决办法是让 Worker 的每次 REST 请求都带唯一 cache-busting 值；中文日文 slug 的百分号编码一开始被路径检查拦掉；WordPress 短暂宕机时不能把“无响应”当成“无文章”缓存成 404，要返回 503 带 retry 头，告诉爬虫过会儿再来；站点实际跑的是 Rank Math，渲染器却按 Yoast 的字段读 SEO 数据，静默失败导致文章没有 schema；还有 Astro 的 scoped CSS 不认 Worker 注入的内容，文章样式得放进全局样式表。

最让我欣赏的是他的验收方式：切换前，把 sitemap、16 个月 Search Console 记录（vapvarun 637 页、buddyxtheme 4631 页）、反链工具、Bing 爬虫记录里每一个 URL 全部抓一遍存底，切换后再抓一遍对比。最终 vapvarun 728 个 URL、buddyxtheme 3220 个、brndle 1451 个全部返回 200；死链的 301 重定向不是按词面匹配，而是去读每条死链背后的真实搜索意图，指向最能回答那个问题的页面。

换架构还顺手解锁了新能力：带真实 last-modified 日期的文章 sitemap、给 AI 助手用的完整 /llms.txt、文章的 FAQ schema——这些在“每次改动全站重建”的模式下都很难做。

我认为这件事的意义在于：它给“WordPress 迁 Astro”这波热闹提供了另一个选项。这阵子独立博客圈铺天盖地都是“我从 WordPress 搬到 Astro”，好像非此即彼。Varun 的答案是：引擎可以不换，渲染模型换掉就行——CMS 管内容、Worker 管渲染、KV 管缓存，静态的速度和 CMS 的灵活性都有了。当然他也划了边界：几十上百个页面、内容很少变的小站，全静态构建依然是最简单的选择。这个“看规模选架构”的判断，比站队哪个平台有用得多。
