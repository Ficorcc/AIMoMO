---
title: "WordPress 7.2 干了两件不显眼但会咬人的事：后台图标换成 SVG，/random/ 默认开启"
pubDate: 2026-11-13
description: "WordPress 7.2 定档 12 月 8 日，RC1 在 11 月 17 日。11 月 5 日两张 dev note 都不是新功能：一是后台菜单和管理栏图标从 Dashicons 字体换成内联 SVG，自定义配色和隐藏图标的 CSS 会失效；二是新增 /random/ 端点且默认开启，而核心至今没有 noindex 选项。这篇讲清会坏在哪、升级前该查什么。"
category: "博客"
image: ""
draft: false
slugId: "momo/blog-wordpress-72-icon-random"
---

WordPress 7.2 的时间表已经很清楚了：11 月 3 日 Beta 4，11 月 17 日 RC1，**12 月 8 日正式版**。

但 11 月 5 日官方发的两张 dev note 值得单独拎出来说。因为它们都不是「新功能」，而是那种装完之后站点看着没啥变化、但某天你发现后台配色不对、或者搜索结果里冒出一堆本来藏着的页面的改动。

这类改动在 WordPress 圈有个传统叫「静默破坏」。7.2 这波，我数了一下，至少两个。

## 一、Dashicons 退出后台：数据没变，画法变了

后台侧边菜单和管理栏的图标，过去十年是 Dashicons 字体字形，靠 CSS `::before` 画出来。这也是为什么那么多插件、配色方案、白标后台主题都靠 `::before` 去改颜色、隐藏、替换图标。

7.2 里，这些图标变成了 `@wordpress/icons` 的内联 SVG，直接写在页面标记里。

**没变的**：注册逻辑照旧。用 Dashicon 注册菜单页面、注册文章类型、注册管理栏节点，依然工作。`$menu` 全局数组、REST API、`get_post_type_object('post')->menu_icon` 返回的还是 `dashicons-admin-post` 这些值。如果你的 Dashicon 在新的 `core-admin` 图标集里有对应项，WordPress 会自动渲染成 SVG 版本。

**会坏的**：

| 你写过的代码 | 7.2 里会发生什么 | 怎么改 |
| --- | --- | --- |
| 自定义管理配色方案，用 `::before` 给图标上色 | 规则打不到图标，核心会套一个「尽力而为」的兜底色，可能不是你想要的 | 在 `div.wp-menu-image` / `.ab-icon` 元素上设 `color`，SVG 靠 `currentColor` 继承；hover、focus、current、open、移动端状态都要补 |
| 用 `display: none` 隐藏 `::before` | 图标重新出现，因为它现在是元素了 | 同时隐藏 `div.wp-menu-image svg` / `.ab-icon` |
| 用背景图 + 透明字形替换图标 | 原来撑出高度的字形盒子没了，图标错位 | 自己写 `content: ""` 和明确的尺寸 |
| 用 `.ab-item::before` 替换 edit / customize / site-editor / my-sites 这些管理栏图标 | 你的字形被藏了，核心图标显示出来，可能两个一起出现 | 同时对 `.ab-item .ab-icon::before` 设同样的 content |
| PHP 里解析管理栏节点标题，找那个空 `<span>` | 除了 `wp-logo`，span 都没了 | 改用新的 `icon` 参数 |
| 用 `.dashicons-admin-post` 定位菜单项 | 12 个核心顶级菜单项不再带这个 class | 改用菜单 ID 或 `menu-icon-*` class |

顺带还加了套图标 API：`wp_register_icon_collection()`、`wp_register_icon()`、`wp_is_valid_icon_name()`，`add_menu_page()`、`register_post_type()` 的 `menu_icon`、`WP_Admin_Bar::add_node()` 的 `icon` 参数都能接受命名空间式的名字，比如 `core-admin/pin`。

**为什么值得换**：屏幕阅读器读字体字形的方式不统一，Windows 高对比度等强制配色模式下字体图标会直接消失，字体加载失败就是一堆方块。SVG 带 `aria-label`、颜色跟随 `currentColor`，这三类问题一起解决。

说实话，这是「正确但会咬人」的改动。技术上没得挑，被咬的主要是两类人：做白标后台（client mode）的代理商，和写自定义配色方案的主题作者。如果你是这两类，现在就该在 staging 上测——修法都是向后兼容的，早点改不影响老版本。

## 二、`/random/` 默认开启，这是另一种性质的问题

同一批 dev note 里的另一件事：7.2 新增随机内容跳转端点。访问 `/random/`，跳到一篇随机已发布文章；也能按分类、标签、作者、自定义文章类型过滤，加了 `randomable` 参数和 `wp_enable_random_content_redirect` 过滤器。

问题在于：**默认开启。**

社区反应相当不客气，主要三个理由：

1. **隐藏内容会被曝光。** WordPress 核心到今天都没有 `noindex` 选项。那些你特意没放进导航、没进 sitemap、只在某个页面链出来一次的内容（活动页、内部说明页、仅员工可见的落地页），现在可能被一个随机数翻出来。爬虫扫到 `/random/`，等于拿到一个持续滚动的「内容彩票」。
2. **`ORDER BY RAND()` 的性能。** 大站上这个查询是出了名的毒药。
3. **代理商被迫写插件。** 手上几百个客户站，要么逐个改，要么维护一个 must-use plugin。

Matt Mullenweg 已经表态说，这个端点不该沿用页面的 URL 结构，所以正式版之前大概率还会改。但「默认开、靠过滤器关」这个方向本身值得吐槽——**一个可能暴露隐藏页面的功能，默认值应该是关，而不是让站长自己去发现它存在。**

如果 7.2 到手后你还没注意到这件事，建议直接加一条 mu-plugin：

```php
add_filter( 'wp_enable_random_content_redirect', '__return_false' );
```

然后再判断你的站点到底需不需要它（做内容站的，随机推荐确实有点用；做企业站和商城的，基本是纯风险）。

## 三、12 月 8 日之前该做的检查

7.2 里其他东西这次不展开——Secrets API、Abilities API、Dashicons 之外还有媒体在浏览器端处理（压缩、缩放、转格式都在上传前完成）、新默认主题 Ipsum、后台资源改成单个文件加载 + 预取。之前几篇都写过。

只说 12 月 8 日之前的实操，我建议按这个顺序：

1. Playground 或 staging 跑一遍 Beta，别碰生产站。
2. 打开后台，看侧边菜单和管理栏图标有没有错位、重影、颜色不对——尤其你的站用了自定义配色方案或者白标插件。
3. 打开 `/random/` 看看它跳去哪。如果站上有不愿被翻出来的页面，加过滤器关掉。
4. 用编辑和店铺管理员的身份各点一遍，不只用管理员。
5. 时间点尽量避开购物季：12 月 8 日在美国、英国、澳洲正是旺季，WooCommerce 站最好等到第一个小版本之后。

## 我的判断

这两个改动放在一起看，能看出 WordPress 现在的处境。

图标改 SVG 是「还债型」更新——它修的是十年前就该修的架构，代价是老样式会断。`/random/` 是「送功能型」更新——它想给静态站补一点动态感，代价是引入了一个没人要求的暴露面。

我更喜欢前者，也理解后者。但两者都指向同一个事实：**WordPress 的升级早就不是「点一下更新」了**。核心越来越像一个平台，平台每一次契约变更，都要所有插件和主题作者跟着对一遍。这对生态是好事（说明它还在动），对个体站长是负担（每次都要重新查一遍自己的小改动有没有被踩到）。

所以 12 月之前，花半小时把上面五条过一遍。这两年最贵的一课，都是「看着没变化」的那次升级给的。
