---
title: "Astro终于有了原生CMS：EmDash 1.0发布，Cloudflare用它替代了WordPress"
pubDate: 2026-09-05
description: "9月初，Cloudflare正式发布EmDash 1.0——一款专为Astro和Cloudflare生态打造的TypeScript内容管理系统。Cloudflare自己的博客已经完全迁移到EmDash，每天处理从75到5000的流量峰值。这件事对独立博主意味着什么？"
category: "博客"
image: ""
draft: false
slugId: "momo/blog-emdash-10-native-astro-cms"
---

最近独立博客圈有个消息，没有上热搜，但我认为它值得单独拿出来聊聊。

9月初，Cloudflare正式发布了EmDash 1.0——一款基于Astro构建的全栈TypeScript CMS。Cloudflare官方博客已经完全从第三方CMS迁移到EmDash，并在官方文档里详细复盘了这次迁移过程。

对独立博主来说，这件事为什么值得关注？我来说说我的看法。

## EmDash是什么

简单说，EmDash是Cloudflare自研的内容管理系统，专门为Astro框架和Cloudflare Pages环境设计。它的目标是：让内容团队在熟悉的编辑界面里工作，同时享受Astro的性能优势和Cloudflare的全球边缘网络。

从技术栈来看：完全使用TypeScript编写，插件通过Dynamic Workers在隔离环境中安全沙盒化运行——这直接解决了WordPress时代最大的安全噩梦：每个插件都是一个潜在的攻击入口。

## Cloudflare用它替代了什么

Cloudflare在8月12日完成了官方博客向EmDash的迁移，这是EmDash的第一个"零号客户"项目。

迁移过程中，Cloudflare的工程师们记录了一个很真实的场景：他们的博客正常负载是每秒75个请求，但热门帖子走红时，峰值会超过每秒5000个请求——而且峰值出现的时间完全随机，无法预测。

首次测试，EmDash处理了每秒450个请求。更重要的是，迁移完成后，它成功抵御了一次每秒28000次请求的DDoS攻击。

不过，作为"零号客户"，Cloudflare也踩了一些坑：帖子排期功能曾经出现问题，编辑侧的体验还不算完美。这些问题他们预计会很快修复。

## 对独立博主来说意味着什么

过去几年，独立博主建站的痛点很明确：

**Astro配WordPress作为后端**？需要维护两套系统，还需要配置API对接，增加了复杂度和维护成本。

**纯Astro写Markdown文件**？对开发者友好，但非技术博主根本没法用——你总不能让帮你写稿的编辑去学git吧？

**用现成的SaaS CMS（如Contentful、Sanity）**？功能强大，但价格不菲，而且离开了浏览器就没有编辑能力。

EmDash试图解决的就是这个问题：**在Astro的基础上，提供一个非技术人员也能用的内容管理界面，同时保持TypeScript的原生体验。**

插件沙盒化运行是另一个关键改进——你可以放心安装第三方插件，不用担心它对你的站点安全造成威胁。这在WordPress生态里是做不到的。

## 这是一场静悄悄的CMS革命

Astro从诞生那天起，就是一个"框架"，而不是一个"系统"。它擅长生成静态页面，部署快、性能好，但内容管理一直是它的短板——你需要自己想办法解决编辑体验的问题。

EmDash的出现，代表着一种思路：**不是在Astro外面嫁接一个CMS，而是把CMS做成Astro生态的一部分。**

对独立博主来说，这个方向值得期待。但也要看到，EmDash目前还比较年轻——生态还在起步，第三方插件和主题暂时无法与WordPress的库相比，文档也还在完善中。对于已经在用Astro写Markdown的博主来说，迁移成本不低。

**但对于那些想从WordPress迁移到Astro、又舍不得放弃可视化编辑体验的人来说，EmDash可能是目前为止最值得关注的选项。**

CMS的战争，才刚刚开始。
