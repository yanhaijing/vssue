<template>
  <div class="vssue-new-comment">
    <div class="vssue-comment-avatar">
      <a
        v-if="user"
        :href="user.homepage"
        :title="user.username"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img :src="user.avatar" :alt="user.username" />
      </a>

      <VssueIcon
        v-else
        :name="platform.toLowerCase()"
        :title="t('loginToComment', { platform })"
        @click="login()"
      />
    </div>
    <!-- .vssue-new-comment-avatar -->

    <div class="vssue-new-comment-body">
      <textarea
        ref="input"
        v-model="content"
        class="vssue-new-comment-input"
        :rows="inputRows"
        :disabled="isInputDisabled"
        :placeholder="t(user ? 'placeholder' : 'noLoginPlaceHolder')"
        :spellcheck="false"
        aria-label="leave a comment"
        @keyup.enter.ctrl="submit()"
      />
    </div>
    <!-- .vssue-new-comment-body -->

    <div class="vssue-new-comment-footer">
      <span v-if="user" class="vssue-current-user">
        <span>{{ t('currentUser') }} - {{ user.username }} - </span>

        <a class="vssue-logout" @click="logout()">
          {{ t('logout') }}
        </a>
      </span>

      <span v-else class="vssue-current-user">
        {{ t('loginToComment', { platform }) }}
      </span>

      <div class="vssue-new-comment-operations">
        <VssueButton
          v-if="user"
          class="vssue-button-submit-comment"
          type="primary"
          :disabled="isSubmitDisabled"
          @click="submit()"
        >
          <VssueIcon v-show="loading" name="loading" />

          {{ t(loading ? 'submitting' : 'submitComment') }}
        </VssueButton>

        <VssueButton
          v-else
          class="vssue-button-login"
          type="primary"
          :title="t('loginToComment', { platform })"
          @click="login()"
        >
          {{ t('login', { platform }) }}
        </VssueButton>
      </div>
    </div>
    <!-- .vssue-new-comment-footer -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '@vssue/core';
import VssueIcon from './VssueIcon';
import VssueButton from './VssueButton';

export default defineComponent({
  name: 'VssueNewComment',

  components: {
    VssueButton,
    VssueIcon,
  },

  setup() {
    const {
      user,
      issue,
      vssueAPI,
      isCreatingComment,
      isPending,
      postComment,
      getComments,
      login,
      logout,
    } = useStore();

    const { t } = useI18n();

    const content = ref('');
    const input: Ref<HTMLInputElement | null> = ref(null);

    const platform = computed(() => vssueAPI?.platform.name || null);
    const loading = computed(() => isCreatingComment.value);
    const isInputDisabled = computed(
      () => loading.value || user.value === null || issue.value === null,
    );
    const isSubmitDisabled = computed(
      () => content.value === '' || isPending.value || issue.value === null,
    );
    const contentRows = computed(() => content.value.split('\n').length - 1);
    const inputRows = computed(() =>
      contentRows.value < 3 ? 5 : contentRows.value + 2,
    );

    // this.vssue.$on('reply-comment', comment => {
    //   const quotedComment = comment.contentRaw.replace(/\n/g, '\n> ');
    //   const replyContent = `@${comment.author.username}\n\n> ${quotedComment}\n\n`;
    //   this.content = this.content.concat(replyContent);
    //   this.focus();
    // });

    // beforeDestroy(): void {
    //   this.vssue.$off('reply-comment');
    // }

    const focus = (): void => {
      if (input.value !== null) {
        input.value.focus();
      }
    };

    const submit = async (): Promise<void> => {
      if (isSubmitDisabled.value) return;
      await postComment({ content: content.value });
      content.value = '';
      await getComments();
    };

    return {
      content,
      user,
      platform,
      inputRows,
      isInputDisabled,
      isSubmitDisabled,
      loading,
      input,
      focus,
      submit,
      login,
      logout,
      t,
    };
  },
});
</script>
