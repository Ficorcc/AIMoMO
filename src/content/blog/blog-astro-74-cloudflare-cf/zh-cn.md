---
title: "Astro 的 Cloudflare 适配器改用 cf 命令行了：你的部署配置，正在被平台慢慢收走"
pubDate: 2026-10-04
description: "10 月初，Astro 的 @astrojs/cloudflare 适配器进入 15.0.0-beta：部署不再走 Wrangler，改用 Cloudflare 新的 cf 命令行，配置也从 wrangler.jsonc 换成 cloudflare.config.ts。便利是真的，但配置文件的每一次改名，都在悄悄增加迁移成本。"
category: "博客"
image: ""
draft: false
slugId: "momo/blog-astro-74-cloudflare-cf"
---

10 月 1 到 2 日，Astro 官方集成仓库放出了一批 beta 版本。最值得独立站长注意的一条是：`@astrojs/cloudflare` 升到 15.0.0-beta，Cloudflare 适配器的部署方式变了——不再走 Wrangler，改用 Cloudflare 新的 `cf` 命令行；配置也从 `wrangler.jsonc` 换成项目根目录下的 `cloudflare.config.ts`。同时 `configPath` 选项被移除，`wrangler` 不再是对等依赖。

配上 `astro@7.4.0-beta`，`astro add cloudflare` 这条命令现在会顺手帮你装好 `cf`、生成 `cloudflare.config.ts` 和对应的类型声明。说白了，官方希望你在 Cloudflare 上开发 Astro，就全程待在 `cf` 这套工具链里。

## cf 是什么

`cf` 是 Cloudflare 9 月 28 日刚开测的统一命令行。按官方说法，它把公开 API 的 2900 多条命令收进一个入口，能管 zones、DNS、存储和安全设置，也能创建、开发、部署 Workers；同时提供 `cf migrate`，把 Wrangler 配置转成 `cloudflare.config.ts`。也就是说，Wrangler 正在被并入一个更大的东西。

而 Astro，是第一个跟着改的官方框架适配器。

同一批更新里还有个小细节：Astro 7.4-beta 允许集成（integrations）控制构建产物写到哪儿——client、server、prerender 的输出目录都能被插件接管，自定义 prerenderer 通过新的 `outputDirectories` 上下文拿到最终位置。看着是内部 API，但方向和上面那件事一致：构建的细节，越来越由平台和插件说了算。

## 这对站长意味着什么

**先说好的一面：体验确实会更顺。** 一个 `cf` 命令管完 DNS 到部署，配置是 TypeScript 类型化的（写错了编辑器直接报错），少装一个 Wrangler，少维护一份 `.jsonc`。对刚上手的人尤其友好。Cloudflare 这半年一直在给 Astro 递梯子——7 月上线 Workers Cache 时，Astro 就是第一个内置集成的框架，官方还公开说在跟 TanStack Start、Next.js（Vinext）谈类似的合作。谁先把框架适配器改造成自家形状，正在变成平台之间的竞争手段。

**再说代价：配置文件的每一次改名，都是一次站队。** 以前 `wrangler.jsonc` 好歹是"半通用"的一份配置，现在换成 `cloudflare.config.ts`，它天然绑在 Cloudflare 的模型上——KV、D1、R2、Workers Cache，这些能力越好用，你越难把站点原样搬到别处。迁移成本没有消失，只是被藏进了"更好的开发体验"里。

**我的建议是三条：**

1. 还在 beta，**别在生产站上追**。想要稳定，就等 15.x 正式版；
2. 如果你已经在 Astro + Cloudflare 上跑，等稳定版出来挑个不赶稿的白天，跑一次 `cf migrate` 试试，别在建站周报的夜里做；
3. 更重要的其实是心态：部署配置早就是你代码库的一部分了，选平台不只是选价格，也是选一套工具链。想留后路，就让站点尽量保持纯静态输出，把平台相关的能力集中到边缘的那几个函数里——真要换门庭，需要重写的只有那一小块。

我不觉得这是坏事。Cloudflare 正在把自己从"托管商"变成"开发平台"，Astro 这类框架是它必须拉拢的一环。作为站长，我关心的只有一件事：这份便利，别变成锁死。眼下它还没锁死——静态输出、开源框架、可自托管的选择都还在。但配置文件的每一次改名，都在提醒你：便利和依赖，通常是同一笔账。
