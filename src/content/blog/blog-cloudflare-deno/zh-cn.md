---
title: "Node.js 之父的谢幕：Cloudflare 收购 Deno，独立运行时还剩一年命"
pubDate: 2026-10-29
description: "Cloudflare 宣布收购 Deno 团队，金额未披露。收购核心不是 Deno 运行时，而是 8 月刚发布的 celld——一个能在自家服务器上跑 Workers 的开源实现。Ryan Dahl 亲自承认 Deno 被 Node 兼容性的引力井吸住，一年后运行时停止开发。"
category: "博客"
image: ""
draft: false
slugId: "momo/blog-cloudflare-deno"
---

10 月 9 日，Cloudflare 官宣收购 Deno。金额没披露，但 Deno 创业这些年一共融了 2600 万美元，红杉领投的 A 轮 2100 万。整个团队并入 Cloudflare，Ryan Dahl——对，就是写 Node.js 的那个 Ryan Dahl——和联合创始人 Bert Belder 一起，去负责一个新方向：让 Workers 的编程模型能在你自己的服务器上跑起来。

## 收购的其实不是 Deno，是 celld

先说个反直觉的点：这笔交易的核心资产不是 Deno 运行时，而是 celld。

celld 是 Deno 团队 8 月刚发布的开源项目，用单个 Rust 二进制实现了 Cloudflare Workers 和 Durable Objects 的编程模型，唯一的外部依赖是对象存储。意思是：以前只有 Cloudflare 网络里能跑的代码，现在你可以在自己机房里拉起一堆 celld 实例，配一个对象存储桶，就能得到一套分布式、可伸缩的 Workers 环境。

而 Cloudflare 自己的开源运行时 workerd，Durable Objects 只支持单实例——本地测试够用，一上规模就歇菜。他们内部想简化生产环境的 Durable Objects 路由，试过没成。所以当 celld 出现时，Workers 首席工程师 Kenton Varda 说团队"欣喜若狂"：这不就是我们想造但没造出来的东西吗？

收购之后，celld 的代码和思路会被合并进 workerd，目标是把"自托管 Workers"从能用到好用。对 Cloudflare 来说，这算补上了平台最大的那块拼图。

## Ryan Dahl 那句大实话

比交易本身更值得琢磨的是 Ryan Dahl 在 Hacker News 上的回复。他承认停止开发 Deno 运行时是"双方共同决定，我同意"，然后说了段相当坦诚的话：

> Deno 最终没有解决它想解决的大问题。它被 Node 兼容性的引力井吸住了——被迫表现得和 Node 一模一样。但为什么要重新实现 Node？它已经能用了。边际的性能、UX、安全收益都不够。我想构建的是真正强大的新抽象。

一个创造了 Node.js、又亲手造了 Deno 想修正 Node 的人，最后承认"修正 Node"这条路走不通。这比任何财报都有说服力。celld 让他兴奋的点在于：这不是"换个 API 访问文件系统和网络"，而是服务器开发的全新模型——扩展性内建在编程模型里，而不是每个应用自己拼基础设施。

## 对用户的实际影响

- Deno 运行时：再维护一年（月度 bug 修复和安全更新），之后停止开发。代码保持开源，欢迎社区接手。
- Deno Deploy：六个月后关闭，付费用户提供迁移到 Cloudflare Workers 的支持。
- JSR（Deno 做的 JS 包注册表）：继续运营，基础设施迁到 Cloudflare。

用 Deno 的兄弟们得开始规划了。这里也提醒一句：技术选型时"独立"不等于"永续"，任何运行时都可能被收购、被停更、被并入更大的平台。

## 我的看法

这是 Cloudflare 四个月内的第二笔开发者工具收购（六月刚收了 Vite 背后的 VoidZero）。一条清晰的线已经出来了：Cloudflare 在把 JavaScript 生态的开发者工具逐个收编，然后统一到 Workers 编程模型上。

Varda 借这事再次回应了"Workers 设计成锁定客户"的指责，他的论据是 Shopify 2022 年要求 Workers 开源才肯用，以及 workerd 开源本身就给用户留了退路。他说："开源、给人留一条逃生通道，才是好生意。"这个表态值得玩味——逃生通道被收购之后，通道本身还算是"逃生"吗？

对独立博客和中小站长来说，这事的信号是：平台级的运行时正在快速收敛。你今天选的技术栈，明天可能就是别人商业版图里的一小块。选开源、选有退路的平台，不是情怀，是保险。
