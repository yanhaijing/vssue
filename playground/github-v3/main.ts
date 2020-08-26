import { createApp, h } from 'vue';
import { createAPI } from '@vssue/api-github-v3';
import type { VssueOptions } from '@vssue/core';
import { Vssue } from '@vssue/theme-default';

// import '@vssue/theme-default/src/styles/index.styl';

const options: Partial<VssueOptions> = {
  api: createAPI,
  owner: import.meta.env.VITE_GITHUB_V3_OWNER as string,
  repo: import.meta.env.VITE_GITHUB_V3_REPO as string,
  clientId: import.meta.env.VITE_GITHUB_V3_CLIENT_ID as string,
  clientSecret: import.meta.env.VITE_GITHUB_V3_CLIENT_SECRET as string,
};

createApp({
  render() {
    return h(Vssue, {
      issueTitle: 'Vssue Dev',
      issueId: 1,
      options,
    });
  },
}).mount('#app');
