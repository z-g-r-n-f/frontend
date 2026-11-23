import {createI18n} from "vue-i18n"

import zhCN from "./locales/zh-CN"
import enUS from "./locales/en-US"
import koKR from "./locales/ko-KR"
import jaJP from "./locales/ja-JP"


// 支持的语言列表（语言切换按钮就靠这份数据生成）
export const languages=[

{
    key:"zh-CN",
    label:"中文"
},

{
    key:"en-US",
    label:"EN"
},

{
    key:"ko-KR",
    label:"한국어"
},

{
    key:"ja-JP",
    label:"日本語"
}

]


// 读取上次选择的语言，没有就默认中文
const savedLocale=
localStorage.getItem("lang") || "zh-CN"


const i18n=createI18n({

    legacy:false,

    globalInjection:true,

    locale:savedLocale,

    fallbackLocale:"zh-CN",

    messages:{

        "zh-CN":zhCN,

        "en-US":enUS,

        "ko-KR":koKR,

        "ja-JP":jaJP

    }

})


export default i18n
