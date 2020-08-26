<template>
  <div class="vssue">
    <Iconfont />
    <VssueHeader />
    <VssueBody />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide } from 'vue';
import { createStore, injectionKeyStore } from '@vssue/core';
import type { VssueOptions } from '@vssue/core';
import { createI18n, installI18n } from './i18n';
import Iconfont from './components/Iconfont.vue';
import VssueHeader from './components/VssueHeader.vue';
import VssueBody from './components/VssueBody.vue';

export default defineComponent({
  name: 'Vssue',

  components: {
    Iconfont,
    VssueHeader,
    VssueBody,
  },

  props: {
    issueTitle: {
      type: String,
      required: false,
    },
    issueId: {
      type: [String, Number],
      required: false,
    },
    options: {
      type: Object,
      required: true,
    },
  },

  setup({ issueTitle = 'default title', issueId = null, options }) {
    // TODO: normalize options
    const vssueOptions = {
      labels: ['Vssue'],
      state: 'Vssue',
      prefix: '[Vssue]',
      admins: [],
      perPage: 10,
      proxy: (url: string): string =>
        `https://cors-anywhere.herokuapp.com/${url}`,
      issueContent: ({ url }): string => url,
      ...(options as Partial<VssueOptions>),
    } as VssueOptions;

    // create and provide vssue store
    const store = createStore({
      issueId,
      issueTitle,
      vssueOptions,
    });
    provide(injectionKeyStore, store);

    // create and install vue-i18n
    const i18n = createI18n(vssueOptions);
    installI18n(i18n);

    // initialize comments on mounted
    onMounted(() => {
      store.initComments();
    });
  },
});
</script>

<style lang="stylus" src="./styles/index.styl"></style>
<style src="github-markdown-css"></style>
