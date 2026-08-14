import { i18n } from '@/lib/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { uiTranslations } from 'fumadocs-ui/i18n';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add('ui', {
    zh: {
      displayName: '中文',
      search: '搜索功能',
      searchNoResult: '未找到结果',
      toc: '本页目录',
      tocNoHeadings: '暂无标题',
      lastUpdate: '最后更新于',
      chooseLanguage: '选择语言',
      nextPage: '下一页',
      previousPage: '上一页',
      chooseTheme: '主题',
      editOnGithub: '在 GitHub 上编辑',
      themeLight: '浅色',
      themeDark: '深色',
      themeSystem: '跟随系统',
      codeBlockCopy: '复制文本',
      codeBlockCopied: '已复制',
      accordionCopyAnchor: '复制链接',
      headingCopyAnchor: '复制标题链接',
      pageActionsCopyMarkdown: '复制 Markdown',
      pageActionsOpen: '打开',
      pageActionsOpenGitHub: '在 GitHub 中打开',
      pageActionsViewMarkdown: '查看 Markdown',
      pageActionsOpenScira: '在 Scira AI 中打开',
      pageActionsOpenChatGPT: '在 ChatGPT 中打开',
      pageActionsOpenClaude: '在 Claude 中打开',
      pageActionsOpenCursor: '在 Cursor 中打开',
      pageActionsOpenInLLMPrompt: '阅读 {url}，我想基于它提问。',
      bannerClose: '关闭横幅',
      searchOpen: '打开搜索',
      searchClose: '关闭搜索',
      menuToggle: '切换菜单',
      themeToggle: '切换主题',
      sidebarOpen: '打开侧边栏',
      sidebarCollapse: '收起侧边栏',
      tocInline: '目录',
      typeTableProp: '属性',
      typeTableType: '类型',
      typeTableDefault: '默认值',
      typeTableParameters: '参数',
      typeTableReturns: '返回值',
      notFoundTitle: '页面未找到',
      notFoundDescription: '你访问的页面可能已被移除、重命名或暂时不可用。',
      notFoundLink: '返回首页',
    },
    en: {
      displayName: 'English',
      search: 'Search features',
    },
  });

export function baseOptions(locale: string): BaseLayoutProps {
  const title = locale === 'en' ? 'WORLD BUILDER Documentation' : 'WORLD BUILDER 操作文档';

  return {
    nav: {
      title,
      url: `/${locale}/docs/`,
    },
    themeSwitch: {
      enabled: false,
    },
  };
}
