import { getCurrentInstance } from 'vue';
import type { Plugin } from 'vue';

/**
 * Should be used inside setup()
 */
export const installI18n = (plugin: Plugin): void => {
  const instance = getCurrentInstance();

  if (instance === null) {
    return;
  }

  // TODO: avoid conflict with existing vue-18n instance
  instance.appContext.app.use(plugin);
};
