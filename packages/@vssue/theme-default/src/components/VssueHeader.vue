<template>
  <div class="vssue-header">
    <!-- comments-count - link to issue -->
    <a
      class="vssue-header-comments-count"
      :href="issue ? issue.link : null"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>
        {{
          comments
            ? t('comments', comments.count, {
                count: comments.count,
              })
            : t('comments', 0)
        }}
      </span>
    </a>

    <!-- powered-by - platform and vssue -->
    <span class="vssue-header-powered-by">
      <span>Powered by </span>

      <a
        :href="vssueAPI.platform.link"
        :title="`${vssueAPI.platform.name} API ${vssueAPI.platform.version}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ vssueAPI.platform.name }}
      </a>

      <span> & </span>

      <a
        href="https://github.com/meteorlxy/vssue"
        :title="`Vssue v${version}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        Vssue
      </a>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '@vssue/core';

export default defineComponent({
  name: 'VssueHeader',

  setup() {
    const { comments, issue, vssueAPI } = useStore();
    const { t } = useI18n();

    return {
      comments,
      issue,
      version: 'TODO',
      vssueAPI,
      t,
    };
  },
});
</script>
