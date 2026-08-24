---
title: "一个 7.8MB 的本地编程 Agent：Vercel 把 fx 开源了，模型随便换"
pubDate: 2026-08-24
description: "Vercel Labs 开源了一款微型本地编程 Agent——fx，大小仅 7.8MB，用 Zig 编写，模型无关，支持 Vercel AI Gateway、OpenAI Codex 和 xAI Grok。这个小工具的思路很有意思：它不是另一个 Claude Code 或 Cursor，而是想做 AI 编程的「底层基础设施」。"
category: "AI"
image: ""
draft: false
slugId: "momo/ai-vercel-fx-tiny-coding-agent"
---

最近有个开源小工具悄悄火了——Vercel Labs 在 8 月 22 日把 **fx** 正式开源了。

## 它是什么

fx 是一个用 Zig 编写的微型本地编程 Agent，二进制文件只有 **7.8MB**。它的目标很明确：做一个模型无关的轻量级 CLI 编程工具。你可以用它调用 Vercel AI Gateway、OpenAI Codex 或 xAI Grok，换模型就像换配置文件一样简单。

光看体积，这个东西确实让人惊讶——7.8MB 是什么概念？一个 Claude Code 客户端安装包可能都比它大一个数量级。Zig 语言的特点在这里发挥了作用：没有运行时依赖，直接编译成静态二进制，部署到哪里都能跑。

## 思路有意思在哪里

我在想这个工具的定位。它不是要取代 Cursor 或 Windsurf 这样的 IDE 插件，而是更像一个「可嵌入的编程 Agent 原子」。

项目主页说它「designed for performance and embeddability in larger systems via WebAssembly」。换句话说，它的野心不只是给开发者用 CLI，而是在底层嵌入到更大的系统里。

举个例子：你的 CI/CD 流水线里需要一个自动修复 bug 的 Agent，不需要跑一个笨重的 Claude Code 服务端，开一个 fx 进程就行。它轻到你可以在 GitHub Actions 里每次构建失败时触发一次，帮你分析日志、自动修 PR。

## 支持的模型

目前支持三个后端：
- **Vercel AI Gateway**：统一管理多模型调用
- **OpenAI Codex**：代码专用模型
- **xAI Grok**：马斯克的模型

Vercel 特别提到它是「model-agnostic」——意思是理论上你接任何兼容 OpenAI API 格式的模型都能用。这个设计思路是对的：大模型更新太快，今天最强不代表三个月后还最强，工具层不应该绑定某一家。

## 为什么值得关注

我觉得这个项目值得关注的理由不是它现在有多强，而是它代表了一种方向：AI 编程工具正在从「大一统的 IDE 插件」向「可组合的原子服务」演进。

以前你想在流水线里加 AI 能力，要么接入一个巨大的服务，要么自己跑一个模型服务。fx 提供了第三种可能：一个小进程，轻到可以按需启动，帮你完成特定任务然后退出。

这种「一次性 Agent」的思路，我觉得比「24小时在线的 AI 助手」更贴近很多真实工作流的需求。构建失败时帮你查日志、修单元测试、生成 commit message——这些都不需要 AI 一直在线。

## 怎么用

```bash
# 安装
curl -fsSL https://fx.vercel.sh | bash

# 或通过 npm
npm install -g @vercel/fx

# 基本用法
fx "fix the bug in src/index.ts"
```

它会启动一个本地进程，你可以在终端里和它对话，也可以把结果直接写回文件。

---

**我的判断**：fx 目前还是 experimental 阶段，能力边界和错误处理还在完善中。但它的体积、架构和定位都很有诚意。如果你对 AI 编程工具的技术实现感兴趣，或者正在考虑如何在自己项目里嵌入 AI 能力，这个项目值得 clone 下来看看源码——毕竟 Zig 代码量不大，7.8MB 里藏着完整的 Agent 逻辑。
