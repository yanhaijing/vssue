import { createI18n as createVueI18n } from 'vue-i18n';
import type { ComposerOptions, LocaleMessages } from 'vue-i18n';
import type { VssueOptions } from '@vssue/core';
import { enUS } from './langs/en-US';
import { zhCN } from './langs/zh-CN';
import { ptBR } from './langs/pt-BR';
import { jaJP } from './langs/ja-JP';
import { heIL } from './langs/he-IL';

export const messages: LocaleMessages<string> = {
  'en': enUS,
  'en-US': enUS,
  'zh': zhCN,
  'zh-CN': zhCN,
  'pt': ptBR,
  'pt-BR': ptBR,
  'ja': jaJP,
  'ja-JP': jaJP,
  'he': heIL,
  'he-IL': heIL,
};

export const createI18n = ({
  locale,
}: VssueOptions): ReturnType<typeof createVueI18n> => {
  let lang: string;

  if (locale) {
    // default locale is specified in options
    lang = locale;
  } else {
    // auto detect user locale
    const locales = Object.keys(messages);
    const navLangs = window.navigator.languages;
    lang = navLangs.filter((item) => locales.includes(item)).shift() || 'en';
  }

  return createVueI18n({
    locale: lang,
    fallbackLocale: 'en',
    messages,
  } as ComposerOptions);
};
