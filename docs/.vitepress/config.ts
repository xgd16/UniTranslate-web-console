import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "UniTranslate",
  description: "UniTranslate 说明文档",
  lang: "zh-CN",
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [
      { text: "🏠 首页", link: "/" },
      { text: "📖 指南", link: "/guide/" },
      { text: "🔧 API", link: "/api/" },
      { text: "💻 GitHub", link: "https://github.com/xgd16/UniTranslate" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "📚 使用指南",
          items: [
            { text: "👋 介绍", link: "/guide/" },
            { text: "🚀 快速开始", link: "/guide/getting-started" },
            { text: "⚙️ 配置", link: "/guide/configuration" },
            { text: "🖥️ Web 控制台", link: "/guide/web-console" },
            { text: "🔐 认证", link: "/guide/authentication" },
          ],
        },
      ],
      "/api/": [
        {
          text: "🔧 API 文档",
          items: [
            { text: "📋 接口概览", link: "/api/" },
            { text: "🔄 翻译接口", link: "/api/translation" },
            { text: "⚙️ 平台管理", link: "/api/platform" },
            { text: "📊 统计监控", link: "/api/statistics" },
            { text: "🛠️ 系统管理", link: "/api/system" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/xgd16/UniTranslate" },
    ],

    footer: {
      message: "使用 GNU AGPL v3.0 许可发布",
      copyright: "Copyright 2024-present UniTranslate Team",
    },

    // 搜索配置
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },

    // 大纲配置
    outline: {
      label: "页面导航",
    },

    // 文档更新时间
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },

    // 文档导航
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
  },
});
