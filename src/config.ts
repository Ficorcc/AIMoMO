import type {
    SiteConfig,
    ProfileConfig,
    LicenseConfig
} from "./types/config"

import type { FriendLink } from "./types/friend"

export const siteConfig: SiteConfig = {
    title: "AI Ficor",
    subTitle: "",

    favicon: "/favicon/favicon.ico", // Path of the favicon, relative to the /public directory

    pageSize: 6, // Number of posts per page
    toc: {
        enable: true,
        depth: 3 // Max depth of the table of contents, between 1 and 4
    },
    blogNavi: {
        enable: true // Whether to enable blog navigation in the blog footer
    },
    comments: {
        enable: true, // Whether to enable comments
        platform: "default", // Comment platform, set "default" to use Momo-backend, also supports "twikoo"
        backendUrl: "https://aimomo-backend-worker.ficor.workers.dev" // Backend URL for comments
    },
    theme: {
        AOS: true, // Whether to enable AOS (Animate On Scroll) for animations
        LQIP: true, // Whether to enable LQIP (Low-Quality Image Placeholder) for image placeholders
        PhotoSwipe: true // Whether to enable PhotoSwipe for image viewer
    }
}

export const profileConfig: ProfileConfig = {
    avatar: "assets/Ficor.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
    name: "AI Ficor",
    description: "A blog about life and technology.",
    indexPage: "https://aimomo.pages.dev",
    startYear: 2026,
}

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const friendLinkConfig: FriendLink[] = [
    {
        name: "荒野菲克",
        avatar: "https://ficor.net/favicon.ico",
        url: "https://ficor.net",
        description: "在路上的思绪与脚印"
    },
    {
        name: "ACEVS",
        avatar: "https://cravatar.cn/avatar/ffc1ac2ecde17b2eb1caff3e94c119fdaea4dc1a947a08a3092b388bf9b454d0?s=32&d=identicon&r=g",
        url: "https://acevs.com",
        description: "你坚持过什么事情？"
    },
    {
        name: "我是军爸",
        avatar: "https://cravatar.cn/avatar/6e688e8773b5bd7dd15d86d97bbb3561",
        url: "https://me.xu19.com",
        description: "记录单片机编程教学、生活与成长点滴"
    },
    {
        name: "瓦匠不舟",
        avatar: "https://cravatar.cn/avatar/060afceaea08afc40f8bcef99fe8542a",
        url: "https://airy.ink",
        description: "大家都是倔强的人"
    },
    {
        name: "Yang\'s Blog",
        avatar: "https://knay.net/avatar/yang.webp",
        url: "https://knay.net",
        description: "一亩三分地，记录生活，分享见闻"
    },
    {
        name: "旺东自留地",
        avatar: "https://wang618.cn/logo.gif",
        url: "https://wang618.cn",
        description: "爱生活、爱摸鱼"
    },
    {
        name: "朱小呆",
        avatar: "https://zhujay.com/images/webhead/wh2.png",
        url: "https://zhujay.com",
        description: "记录生活分享美好"
    },
    {
        name: "西风",
        avatar: "https://xifeng.net/images/avatar.svg",
        url: "https://xifeng.net",
        description: "源于热爱而去创造"
    },
    {
        name: "且听书吟",
        avatar: "https://yufan.me/logo.svg",
        url: "https://yufan.me",
        description: "诗与梦想的远方"
    },
    {
        name: "旅行漫记",
        avatar: "https://synyan.cn/wp-content/themes/hera-develop/build/images/logo-s.png",
        url: "https://synyan.cn",
        description: "博物馆爱好者"
    },
    {
        name: "1900\'Blog",
        avatar: "https://1900.live/logo.svg",
        url: "https://1900.live",
        description: "孤独的互联网冲浪大师"
    },
    {
        name: "老张博客",
        avatar: "http://pic.laozhang.org/i/2023/04/07/642f72584c9a1.png",
        url: "https://laozhang.org",
        description: "生活琐记，技术折腾，乐在记录点滴与分享"
    },
    {
        name: "老刘博客",
        avatar: "https://iliu.org/img/favicon.ico",
        url: "https://iliu.org",
        description: "热爱传统文化，验光师"
    },
    {
        name: "似水流年",
        avatar: "https://weavatar.com/avatar/65cd1f408c1cc0949b34d3cd2acad0cb5a2b8c362ebf31ca9ee0dc9edcc63e81?s=100&r=g",
        url: "https://my1981.cn",
        description: "如花美眷，怎敌得过似水流年"
    },
    {
        name: "陈锐—响石潭",
        avatar: "https://www.chenrui.com/zb_users/upload/2026/01/20260103005431176737287110422.png",
        url: "https://www.chenrui.com",
        description: "记录活着"
    },
    {
        name: "皇家园林",
        avatar: "https://img.hjyl.org/uploads/2019/10/about-me.png",
        url: "https://hjyl.org",
        description: "欢迎来到皇家元林"
    },
    {
        name: "子夜松声",
        avatar: "https://cn.cravatar.com/avatar/120340d1df519f4e28613fe5d404b286?s=96&d=mp&r=g",
        url: "https://xyzbz.cn",
        description: "互联网爱好者"
    },
    {
        name: "Counting Stars💫",
        avatar: "https://weavatar.com/avatar/d44fe4344f5b822fe55c92d04b874cbad2e22babd866c8a462d71afb0e86e9b5?d=letter&letter=%E8%90%BD",
        url: "https://hux.ink",
        description: "欲买桂花同载酒，终不似，少年游"
    },
    {
        name: "老T博客",
        avatar: "https://lawtee.com/images/favicon.png",
        url: "https://lawtee.com",
        description: "聚焦法律、科技和生活"
    },
    {
        name: "蒙需",
        avatar: "https://img.ficor.net/uploads/2025/11/6914480601006.webp",
        url: "https://jiangcl.com",
        description: "律师"
    },
    {
        name: "破袜子",
        avatar: "https://pewae.com/wp-content/uploads/cropped-logo-20251231-1-270x270.png",
        url: "https://pewae.com",
        description: "一个脱离不了低级趣味的人"
    },
    {
        name: "Keyle\'s Blog",
        avatar: "https://vrast.cn/favicon.ico",
        url: "https://vrast.cn",
        description: "记录一些偶尔冒出来转眼就会忘的灵感"
    },
    {
        name: "孤鬥",
        avatar: "https://img.ficor.net/uploads/2025/11/6914480601006.webp",
        url: "https://d-d.design",
        description: "做自己，不隨波逐流，不妥協"
    },
    {
        name: "木竹",
        avatar: "https://www.laomuzhu.cn/img/touxiang.jpg",
        url: "https://www.laomuzhu.cn",
        description: "在字里行间慢慢生长"
    },
    {
        name: "三十海河",
        avatar: "https://ihaihe.cn/wp-content/uploads/2025/03/touxiang.png",
        url: "https://ihaihe.cn",
        description: "扩大自己的自由边界"
    },
    {
        name: "彬红茶日记",
        avatar: "https://note.redcha.cn/upload/favicon-256x256.png",
        url: "https://note.redcha.cn",
        description: "生活原本沉闷，但跑起来就有风"
    },
    {
        name: "obaby@mars",
        avatar: "https://gg.lang.bi/avatar/d6ebc088df916bcc9e8b94a09f9b0f604e57be54b04bd520c6db2492740fc563?s=90&d=identicon&r=r",
        url: "https://zhongxiaojie.com",
        description: "黑客程序媛"
    },
    {
        name: "皮皮社",
        avatar: "https://www.pipishe.com/tx.webp",
        url: "https://www.pipishe.com",
        description: "皮一下~很开心"
    },
    {
        name: "Jack\'s Space",
        avatar: "https://veryjack.com/wp-content/uploads/2025/05/avatar_transparent.webp",
        url: "https://veryjack.com",
        description: "Everything happens for the best"
    },
    {
        name: "雅余",
        avatar: "https://yayu.net/wp-content/themes/yayu/assets/images/icon.png",
        url: "https://yayu.net",
        description: "茶余饭后，闲情雅致"
    },
    {
        name: "灰常记忆",
        avatar: "https://bestcherish.com/image/favicon.svg",
        url: "https://bestcherish.com",
        description: "记录生活 珍藏回忆"
    },
    {
        name: "韩情脉脉",
        avatar: "https://www.hxy.cc/ico.png",
        url: "https://www.hxy.cc",
        description: "任何记录都是为了让以后有迹可循"
    },
    {
        name: "全局变量",
        avatar: "https://img.ficor.net/uploads/2025/11/6914480601006.webp",
        url: "https://ilogs.cn",
        description: "记录生活中的平凡事"
    },
    {
        name: "笔记星球",
        avatar: "https://note-star.cn/shortcut/logo.ico",
        url: "https://note-star.cn",
        description: "网页中的诗意与宁静"
    },
    {
        name: "燕渡寒潭",
        avatar: "https://cravatar.cn/avatar/c822f896a44080703a0845eb6a1ead02d72859e9e0273df32806698db9516512?s=42&r=g",
        url: "https://hisherry.com",
        description: "别为活命而败坏生存之根"
    },
    {
        name: "我心向阳",
        avatar: "https://www.hollowman.cn/favicon.png",
        url: "https://www.hollowman.cn",
        description: "看清生活的真相后依然热爱生活"
    },
    {
        name: "莫比乌斯",
        avatar: "https://onojyun.com/wp-content/uploads/2024/03/a2d42-cropped-mobius_icon_black-edited.png",
        url: "https://onojyun.com",
        description: "写作，是一场自我悖驳的旅程"
    },
    {
        name: "梦幻辰风",
        avatar: "https://www.mhcf.net/mhcf.ico",
        url: "https://www.mhcf.net",
        description: "壹个永恒的部落格"
    },
    {
        name: "品味苏州",
        avatar: "https://pwsz.com/myimg/pwsz_logo.png",
        url: "https://pwsz.com",
        description: "生活在人间天堂"
    },
    {
        name: "徐建伟",
        avatar: "https://www.gravatar.com/avatar/?d=mp",
        url: "http://www.xulog.cn",
        description: "记录生活 珍藏回忆"
    },
    {
        name: "崔话记",
        avatar: "https://cuixiping.com/logo-cat.svg",
        url: "https://cuixiping.com",
        description: "向着理想的方向，爬一会儿，躺一会儿"
    },
    {
        name: "周天记",
        avatar: "https://bu.dusays.com/2023/01/29/63d5bf7fa0d2c.png",
        url: "https://zhoutian.com",
        description: "记录生活里的小美好"
    }
]
