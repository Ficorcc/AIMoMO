---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 03bce104f8581472252c9414909234ca_4a60f4d4da4711f1bff2525400cd780f
    ReservedCode1: lYg+QblgB2rGSI7nG9vAlZZ49Nw1KYc/NOISz24Qj9IrZzR7+L6oWGcOjlSaTtheBgV2FqX58JgZhr+HjTVE8yyg0cuPIH2LmymRWJOnPUm7Y6AOPBV0sr102HSy87Ks5VV7PhTNKvcdo19r6+hY5kpNNZUfrREwH1iYXgWnzPyiWjrIBcsfqUkH4Z8=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 03bce104f8581472252c9414909234ca_4a60f4d4da4711f1bff2525400cd780f
    ReservedCode2: lYg+QblgB2rGSI7nG9vAlZZ49Nw1KYc/NOISz24Qj9IrZzR7+L6oWGcOjlSaTtheBgV2FqX58JgZhr+HjTVE8yyg0cuPIH2LmymRWJOnPUm7Y6AOPBV0sr102HSy87Ks5VV7PhTNKvcdo19r6+hY5kpNNZUfrREwH1iYXgWnzPyiWjrIBcsfqUkH4Z8=
title: "把自己网站和 Instagram 绑在一起，就等于同意 Meta 来爬：一份条款暂停生效背后的授权陷阱"
pubDate: 2026-11-07
description: "10 月 8 日 Meta 提出新版商业条款，其中一句允许它用自动化手段抓取、索引、分析那些在 Facebook、Instagram、WhatsApp 上做生意的企业所关联网站的内容。原定 10 月 30 日生效，舆论反应强烈后推到 11 月 20 日，并删掉「train」字眼，但仍保留内容可用于开发商业产品的措辞。这篇聊独立博客真正该关心什么。"
category: "博客"
image: ""
draft: false
slugId: "momo/blog-meta-scraping-terms-paused"
---



这件事对独立博客来说，比任何一次主题改版都重要，因为它动的不是你的 CSS，是你内容的授权规则。

10 月 8 日，Meta 提出了一组新版条款：Meta Commercial Terms、Product Catalog Terms、Self-Serve Ad Terms，以及 Ad Creative Generative AI Terms。条款里有一句关键的话——允许 Meta 用自动化手段去抓取、索引、分析那些**用 Facebook、Instagram、WhatsApp 或者 Messenger 做生意**的企业所关联网站的内容。

翻译成人话：只要你把某个域名和 Meta 的商业账号绑在一起，你就等于同意了它来爬。

## 时间线很短，但信息量很大

原定 10 月 30 日生效，舆论炸了，先推到 11 月 20 日，同时删掉了明确写着"训练（train）"的字眼。但改后的措辞仍然保留了内容可以被用于"开发商业产品，包括生成式 AI 服务"。

然后事情加速了。

11 月 3 日，巴西圣保罗第 44 民事法院的法官 Guilherme Madeira Dezem 应三家媒体协会——ANJ（报纸）、ABERT（广播电视）、ANER（杂志）——的联合申请，发出了初步禁令。禁令禁止 Meta 用自动抓取工具收集这些协会成员网站上的新闻、图片、视频，也禁止把这些材料用于开发或训练 Meta AI。违反的话，每日罚款 100 万雷亚尔，上限 1 亿雷亚尔。

同一天前后，挪威的法院也发了初步禁令。九天之内，两个国家的法院先动了手。

英国竞争与市场管理局（CMA）另外正式开了一个调查，方向是是否滥用市场支配地位。这个路径要说明一下：按英国竞争法第二章，一旦认定违法，罚款上限可以到全球年营业额的 10%，而且违规持续期间可以逐年叠加。但 CMA 自己也明确说了，现阶段不应该假设已经构成违法——它还只是事实调查阶段，而且这个调查不会因为 Meta 撤了条款就自动关掉。

美国那边，参议员 Adam Schiff 和 Marsha Blackburn 联名给扎克伯格写信，要求撤回这项政策。

11 月 5 日，Meta 把条款预览的链接撤了，Business Help Center 更新成一句话："这些更新现已暂停，不会在 2026 年 11 月 20 日生效。"没给新的时间表，措辞是"无限期"。

Meta 的解释一直是：这些改动是为了改进广告推荐。

## 我为什么觉得这件事值得站长认真看

**第一，合同可以覆盖 robots.txt。**

过去十几年，站长拒绝爬虫靠两样东西：robots.txt 和 UA 黑名单。这是技术层面的"不欢迎"。但这次 Meta 走的不是技术，是**合同法**——你在用它的商业服务，服务条款里写了它有权爬你关联网站，那 robots.txt 就变成了一张没人理会的告示。

这是我觉得最需要记住的一点。技术手段挡得住不守规矩的爬虫，挡不住有律师团队写出来的条款。

**第二，独立博客的风险其实不均匀。**

如果你的站只是纯内容站，没绑任何商业账号，这次条款基本扫不到你。但很多独立博主是"一人多摊"：博客 + 小店 + 企业邮箱 + WhatsApp Business 客服，域名是同一个。这种情况下你就在射程里。

我自己以后会做一件事：把"商业用途"和"内容发布"这两件事的域名彻底分开。听着有点小题大做，但这是最便宜的风险隔离。

**第三，真正起作用的不是站长的技术反制，是监管。**

九天里让 Meta 后退的，是巴西和挪威的法院，是英国 CMA，是出版商的协会。没有一个独立博客在这件事里有单独的谈判能力。

这话有点泄气，但它是现实：内容授权这件事，个人博主的杠杆永远是"集体规则"，不是"个人设置"。所以关注这类监管动作，比反复调 robots.txt 更有用。

## 也别以为这事结束了

我的判断是：这次是战术撤退，不是战略放弃。

证据在措辞里——删掉"训练"两个字，但留下"开发商业产品，包括生成式 AI 服务"。这个表述的弹性足够大，下一次换个说法回来完全不需要重新设计。

而且路径依赖摆在那儿：只要"用平台做生意"和"同意被爬"还能被绑在同一份条款里，这个尝试就会反复出现，只是包装不同。

## 最后

对独立博客来说，这件事的实际功课有三条：把授权范围写清楚（站内声明比 robots.txt 更硬）、把商业身份和内容域名分开、看到类似条款更新时别直接点"同意"。

更根本的一点：我们习惯了把"内容"当作品，其实它同时是**资产**，资产是要管授权边界的。这次 Meta 只是把这个问题提前摔在了桌面上——而且它摔得很响，九天里被两个国家的法院按住了。

下次它回来的时候，未必这么响。
*（内容由AI生成，仅供参考）*
