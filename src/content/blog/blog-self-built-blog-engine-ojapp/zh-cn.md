---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 03bce104f8581472252c9414909234ca_603e3190d97e11f1bff2525400cd780f
    ReservedCode1: Uin25amGeqzsBKKBP4DC/FGOIGhtzJ4DvkKmdyUvJXUDRwOe1aU0xian4AytWx/N7zrxZYFr18orvKcyZv8iNYZRRCGB0GT3jFIDghm0fSYyWzL0S9cLw/xcScIyEmJIGBOzo3eJ16TtgrHi5bIlqEj5ku/OLOXAetkIeUSmLwOxmMVAlZoOtl2oj/w=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 03bce104f8581472252c9414909234ca_603e3190d97e11f1bff2525400cd780f
    ReservedCode2: Uin25amGeqzsBKKBP4DC/FGOIGhtzJ4DvkKmdyUvJXUDRwOe1aU0xian4AytWx/N7zrxZYFr18orvKcyZv8iNYZRRCGB0GT3jFIDghm0fSYyWzL0S9cLw/xcScIyEmJIGBOzo3eJ16TtgrHi5bIlqEj5ku/OLOXAetkIeUSmLwOxmMVAlZoOtl2oj/w=
title: "写了两百多篇文章后，他离开 WordPress 自己写了个生成器：OJapp Blog Kit 的四个克制"
pubDate: 2026-11-06
description: "11 月 3 日一篇《Why I Left WordPress and Built My Own Blog Engine》被反复转发。作者运营日英双语两百多篇的站点，迁移后没换 Astro 也没换 Hugo，而是自己写了个静态生成器并开源成 OJapp Blog Kit：Markdown 写正文、articles.json 管元数据、Cloudflare Pages 托管。这篇聊它为什么刻意做小。"
category: "博客"
image: ""
draft: false
slugId: "momo/blog-self-built-blog-engine-ojapp"
---



11 月 3 日读到一篇文章，标题很直白：《Why I Left WordPress and Built My Own Blog Engine》。作者运营一个叫 Tips 的双语站，日文加英文两百多篇，迁移完之后把自己做的这套东西开源成了 OJapp Blog Kit。

这几年「离开 WordPress」的故事已经听太多，多数结局是换成 Astro 或者 Hugo，换汤不换药。这个人多走了一步：**自己写生成器。**

## 他做的东西其实很小

用 Markdown 写正文，构建成静态 HTML 发布出去。文章元数据放 `articles.json`，站点配置放 `site.json`，托管在 Cloudflare Pages 上。

他特意强调，这个工具是刻意做小的：不做后台面板，不做内置编辑器，不做定时发布，不做统计。就四件事——写文章、管元数据、生成站点、发布。

我挺认同这个取舍。自建工具的诱惑就是不断加功能，加到最后又变成一个小 WordPress，然后你又开始讨厌它。

## 真正难的是搬家

我认为这篇文章里最有价值的部分，是他老老实实写了迁移的坑。

两百多篇文章、两种语言，正文搬过去只是第一步。真正麻烦的是永久链接、译文对应关系、图片、元数据、站内链接——这些在 CMS 里被自动处理的脏活，到了静态站全得自己负责。

他碰到两个 bug 值得记一下。一个是目录（TOC）里出现了 `&quot;` 这种 HTML 实体被当成字面文字显示，问题出在生成目录时的转义和解码；另一个更玄，Wrangler 命令看起来正常启动，却不上传任何文件就退出了，清理临时文件、改配置之后恢复了。

然后是我最喜欢的一句话：**他无法确定到底是哪个改动修好了部署，所以他不会假装知道。**

这种诚实，在技术博客里罕见。大部分人会倒推出一个干净利落的因果链，他没有。

## 好处不是 Lighthouse 分数

他的站迁移之后 Lighthouse 成绩确实很好。但他说，最让他满意的不是分数，是**发一篇文章需要碰几个地方**。

写内容、更新元数据、跑构建、发布。想改版式就直接改文件。他知道活儿发生在哪，不用在几个后台界面之间找入口。

代价也很直接：改了文件不会立刻上线，构建和部署这两步还得走；没有插件生态，评论、搜索、图床、SEO 结构全得自己造或者自己接；生成器有 bug 的时候，你就是唯一的维护者。

## 我的判断

先泼点冷水：**我不建议大多数人照抄这件事。**

自己写博客引擎，开发只需要几天，迁移和维护是几年的账。你会在一个无人问津的目录锚点 bug 上耗掉一个晚上，也会在某次 Node 大版本升级后发现构建全挂。内容创作者最宝贵的资源是写，不是修工具。

但这件事有两层意思值得留意。

一是衡量标准的问题。我们平时评价建站方案，习惯比性能、比生态、比插件数量，他给出的标准是「从想法到一篇文章上线，中间有几个动作」。这个标准很朴素，却很贴近实际体验。我自己的站是 Astro，日常最舒服的地方也不是快，而是写一个 Markdown 文件推上去就完事——不需要登录、不需要点保存、不需要等缓存刷新。

二是独立博客圈的情绪。今年从 Typecho 到 WordPress，再到各种静态框架，讨论的重心明显从「选哪个 CMS」漂到了「要不要 CMS」。一方面是平台的规则和算法越来越不可控，另一方面是外部依赖带来的不确定性越来越难忍——插件供应链、CDN 政策、托管商的计费变动，每一样都可能让一个站一夜之间变形。自建引擎不一定更安全，但它至少让「谁会改坏我的站」这件事有了确定的答案：只可能是你自己。

如果你也想动手，我的建议是三步走：先用现成的静态框架（Astro、Hugo 都行）把迁移跑一遍，搞清楚自己真正在意的是哪几个环节；再决定是写脚本补上这些环节，还是直接 fork 一个框架；最后才是考虑完全自研。跳过前两步直接开写，通常会在三个月后得到一个功能残缺、文档为零的小 WordPress。

他的结论我也认同——把围绕写作的一切做到尽可能小。这话说起来像口号，做起来就是不断删功能。能忍住不加东西，比能写出生成器难多了。
*（内容由AI生成，仅供参考）*
