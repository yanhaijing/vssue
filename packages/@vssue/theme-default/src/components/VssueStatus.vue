<template>
  <div v-if="status" class="vssue-status">
    <VssueIcon
      v-if="['failed', 'loadingComments', 'initializing'].includes(status)"
      :name="status === 'failed' ? 'error' : 'loading'"
    />

    <p class="vssue-status-info">
      <Component
        :is="
          ['issueNotCreated', 'loginRequired'].includes(status) ? 'a' : 'span'
        "
        @click="handleClick"
      >
        {{ t(status) }}
      </Component>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '@vssue/core';
import TransitionFade from './TransitionFade';
import VssueIcon from './VssueIcon';

export default defineComponent({
  name: 'VssueStatus',

  components: {
    TransitionFade,
    VssueIcon,
  },

  setup() {
    const {
      comments,
      isInitializing,
      isFailed,
      isIssueNotCreated,
      isCreatingIssue,
      isLogin,
      isAdmin,
      isLoginRequired,
      postIssue,
      login,
    } = useStore();

    const { t } = useI18n();

    const status = computed(() => {
      if (isFailed.value) {
        return 'failed';
      }
      if (isInitializing.value) {
        return 'initializing';
      }
      if (isIssueNotCreated.value && !isCreatingIssue.value) {
        if (isAdmin.value || !isLogin.value) {
          return 'issueNotCreated';
        }
        return 'failed';
      }
      if (isLoginRequired.value) {
        return 'loginRequired';
      }
      if (!comments.value || isCreatingIssue.value) {
        return 'loadingComments';
      }
      if (comments.value?.data.length === 0) {
        return 'noComments';
      }
      return null;
    });

    const handleClick = (): void => {
      if (status.value === 'issueNotCreated') {
        postIssue();
      } else if (status.value === 'loginRequired') {
        login();
      }
    };

    return {
      status,
      handleClick,
      t,
    };
  },
});
</script>
