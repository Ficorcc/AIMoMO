---
title: "Cloudflare 一边把 Workers 免费包放宽到 64 MiB，一边劝你别再用 Pages：独立博客该跟吗？"
pubDate: 2026-09-14
description: "9 月 4 日起，Cloudflare 把 Workers 的代码包上限从「压缩后体积」改成「未压缩 64 MiB」，免费版和付费版一把拉平。同期的文档又在明确暗示：新项目请用 Workers，别再用 Pages。对独立博客来说，托管这盘棋的座次正在重排——该不该换，取决于你图什么。"
category: "博客"
image: ""
draft: false
slugId: "momo/blog-cloudflare-pages-to-workers"
---

## 9 月 4 日，Cloudflare 悄悄改了规则

如果你是那种「构建一切正常，却在部署时被冷冰冰地提示『压缩后超过 3 MB』」的倒霉蛋，这条消息值得看一眼。

从 2026 年 9 月 4 日起，Cloudflare Workers 的代码包上限**不再看 gzip 压缩后的大小**，统一改为按**未压缩包体积**计算，免费版和付费版都是 **64 MiB**。以前的老规则是这样的：免费版压缩后超 3 MB 直接拒，付费版超 10 MB 拦下。问题在于压缩率本身不稳定——同样的代码，依赖结构略复杂一点，gzip 出来的体积可能天差地别，很多能正常构建的项目就栽在这「临门一脚」。

有两点我得提醒，免得被标题党带偏：

- **别简单说成「免费版容量涨了 21 倍」。** 新旧是两个测量维度（一个压缩后、一个未压缩），不能直接换算。但从实际体验看，以前因为体积被拒的项目，现在基本都能过。
- 想自己验证，跑 `wrangler deploy --dry-run`，看输出里的 **Total Upload**（未压缩），那才是真正计入 64 MiB 的指标；后面的 gzip 数值只作参考。

另外别忘了，静态资源请求在免费和付费计划里都是**免费且不限量**的。对纯静态博客来说，这几乎等于零成本托管。

## 同期的另一件事：Cloudflare 在「劝退」Pages

比起放宽体积，更值得独立博主注意的是文档里的措辞。

Cloudflare 的 Workers 文档现在写得很直白：**如果你在启动一个新项目，请用 Workers，不要用 Pages。** Workers Static Assets 被列为部署静态站点、SPA 和全栈应用的推荐方式。原话大意是：Pages 仍然能用，但新功能和优化都集中在 Workers 上。

这里要澄清一个被炒得很凶的误传：**真正被官方标记为 deprecated 的，是 Workers Sites**——那是比 Pages 更老、完全不同的一个功能，它被 Workers Static Assets 取代。很多「Pages 已废弃」的说法，其实说的是 Workers Sites。Pages 至今没有官方 EOL，还能用、还能新建，但事实状态是「新项目不推荐」。Workers 技术负责人 Kenton Varda 那句话很传神：**我们正在把 Pages 特有的功能，变成 Workers 的通用功能。**

## 对独立博客意味着什么

Pages 的好处，是「连仓库、填构建命令、完事」，每个分支给预览链接，对不懂基础设施的人最友好。**纯静态博客（HTML/CSS/JS，没有服务端路由），用 Pages 依旧是最省心的路径。**

但 Workers 这几年把 Pages 缺的东西都补上了：Durable Objects、Cron Triggers（定时任务）、Queue 消费者、Email Workers（接收邮件）、Secrets Store，以及更完整的可观测性。对博客来说，这意味着你可以顺手加上「定时发布检查」「评论 / 搜索的边缘 API」「构建异常告警」这些小事，而不用再维护两套项目。

而且 Cloudflare 把**静态资源在 Workers 上做成免费无限、Pages Functions 按 Workers 费率计费**——过去「留在 Pages 更便宜」这个理由，基本被搬走了。付费也是同一个 $5/月、同一个账号额度。

## 我的判断

**纯静态的个人博客，没必要为 FOMO 去迁移：能用就先别动。** Pages 至少还能安稳跑一阵，官方也没说要关。

但如果你正打算**开一个新站**，或者想给博客加一点「跑在边缘上的小服务」，那就从 Workers Static Assets 起步——它是 Cloudflare 明确押注的方向，而 9 月 4 日这次「64 MiB 解绑」，正好拆掉了过去最烦人的那道门槛。迁移其实也没那么吓人：把 `wrangler pages dev/deploy` 换成 `wrangler dev/deploy`，把构建产物目录指给 `assets.directory`，`_headers`/`_redirects` 依然原生支持。

顺带提一句周边：Vercel 的免费 Hobby 只限个人非商业用途，挂个广告都得升级 Pro；GitHub Pages 免费但**没有 PR 预览**，而且免费层要公开仓库；Netlify 免费额度则被切成了一套容易算错的 credit。托管这盘棋，2026 年正在重新排座次。Cloudflare 这一手，是把「免费静态托管」的天平又往自己这边压了一格。

所以问题其实不是「Pages 会不会死」，而是——**你的博客，到底还想不想只当一份静态文件？** 想，就按兵不动；想让它长出点别的，那扇门现在开得正是时候。
