<template>
  <div
    class="vssue-comment"
    :class="{
      'vssue-comment-edit-mode': editMode,
      'vssue-comment-disabled': isDeletingComment || isPutingComment,
    }"
  >
    <!-- avatar -->
    <div class="vssue-comment-avatar">
      <a
        :href="author.homepage"
        :title="author.username"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img :src="author.avatar" :alt="author.username" />
      </a>
    </div>

    <!-- comment -->
    <div class="vssue-comment-body">
      <slot name="body">
        <div class="vssue-comment-header">
          <!-- author - username - link to profile page -->
          <span class="vssue-comment-author">
            <a
              :href="author.homepage"
              :title="author.username"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ author.username }}
            </a>
          </span>

          <!-- created-at -->
          <span class="vssue-comment-created-at">
            {{ createdAt }}
          </span>
        </div>

        <!-- comment content - html string - we trust platform api so use v-html -->
        <div class="vssue-comment-main">
          <textarea
            v-if="editMode"
            ref="input"
            v-model="editContent"
            class="vssue-edit-comment-input"
            :rows="editInputRows"
            @keyup.enter.ctrl="updateComment()"
          />

          <!-- eslint-disable vue/no-v-html -->
          <article v-else class="markdown-body" v-html="content" />
          <!-- eslint-enable vue/no-v-html -->
        </div>

        <div class="vssue-comment-footer">
          <!-- edit mode hint -->
          <span v-if="editMode" class="vssue-comment-hint">
            {{ t('editMode') }}
          </span>

          <!-- reactions -->
          <span v-if="showReactions" class="vssue-comment-reactions">
            <span
              v-for="reaction in reactionKeys"
              :key="reaction"
              class="vssue-comment-reaction"
              :title="
                t(creatingReactions.includes(reaction) ? 'loading' : reaction)
              "
              @click="postReaction({ reaction: reaction })"
            >
              <VssueIcon
                :name="
                  creatingReactions.includes(reaction) ? 'loading' : reaction
                "
                :title="
                  t(creatingReactions.includes(reaction) ? 'loading' : reaction)
                "
              />

              <span class="vssue-comment-reaction-number">
                {{ comment.reactions[reaction] }}
              </span>
            </span>
          </span>

          <!-- operations -->
          <span class="vssue-comment-operations">
            <span
              v-if="comment.author.username === currentUser && editMode"
              class="vssue-comment-operation"
              :class="{ 'vssue-comment-operation-muted': isPutingComment }"
              :title="t(isPutingComment ? 'loading' : 'submit')"
              @click="updateComment()"
            >
              <VssueIcon
                v-show="isPutingComment"
                name="loading"
                :title="t('loading')"
              />

              {{ t('submit') }}
            </span>

            <span
              v-if="comment.author.username === currentUser && editMode"
              class="vssue-comment-operation vssue-comment-operation-muted"
              :title="t('cancel')"
              @click="resetEdit()"
            >
              {{ t('cancel') }}
            </span>

            <span
              v-if="comment.author.username === currentUser"
              v-show="!editMode"
              class="vssue-comment-operation"
              @click="enterEdit()"
            >
              <VssueIcon name="edit" :title="t('edit')" />
            </span>

            <span
              v-if="comment.author.username === currentUser || isAdmin"
              v-show="!editMode"
              class="vssue-comment-operation"
              @click="removeComment()"
            >
              <VssueIcon
                :name="isDeletingComment ? 'loading' : 'delete'"
                :title="t(isDeletingComment ? 'loading' : 'delete')"
              />
            </span>

            <span v-show="!editMode" class="vssue-comment-operation">
              <!-- @click="vssue.$emit('reply-comment', comment)" -->
              <VssueIcon name="reply" :title="t('reply')" />
            </span>
          </span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '@vssue/core';
import type { VssueAPI } from '@vssue/core';
import { formatDateTime } from '@vssue/utils';
import VssueIcon from './VssueIcon';

export default defineComponent({
  name: 'VssueComment',

  components: {
    VssueIcon,
  },

  props: {
    comment: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const comment = props.comment as VssueAPI.Comment;

    const {
      vssueAPI,
      query,
      user,
      comments,
      isAdmin,
      isPending,
      getComments,
      putComment,
      deleteComment,
      getCommentReactions,
      postCommentReaction,
    } = useStore();

    const { t } = useI18n();

    const input: Ref<HTMLInputElement | null> = ref(null);

    const editMode = ref(false);
    const editContent = ref(comment.contentRaw);
    const creatingReactions: Ref<Array<keyof VssueAPI.Reactions>> = ref([]);
    const isPutingComment = ref(false);
    const isDeletingComment = ref(false);

    const currentUser = computed(() => user.value?.username || null);
    const content = computed(() => comment.content);
    const author = computed(() => comment.author);
    const createdAt = computed(() => formatDateTime(comment.createdAt));
    const updatedAt = computed(() => formatDateTime(comment.updatedAt));
    const showReactions = computed(
      () =>
        vssueAPI.platform.meta.reactable &&
        !!comment.reactions &&
        !editMode.value,
    );
    const reactionKeys: Ref<Array<keyof VssueAPI.Reactions>> = computed(() => [
      'heart',
      'like',
      'unlike',
    ]);
    const editContentRows = computed(
      () => editContent.value.split('\n').length - 1,
    );
    const editInputRows = computed(() =>
      editContentRows.value < 3 ? 5 : editContentRows.value + 2,
    );

    const postReaction = async ({
      reaction,
    }: {
      reaction: keyof VssueAPI.Reactions;
    }): Promise<void> => {
      try {
        if (creatingReactions.value.includes(reaction)) return;

        creatingReactions.value.push(reaction);

        const success = await postCommentReaction({
          commentId: comment.id,
          reaction,
        });

        if (!success) {
          // this.vssue.$emit(
          //   'error',
          //   new Error(
          //     this.t('reactionGiven', {
          //       reaction: this.t(reaction),
          //     }) as string,
          //   ),
          // );
        }

        // always refresh reactions even already given
        const reactions = await getCommentReactions({
          commentId: comment.id,
        });
        if (reactions) {
          comment.reactions = reactions;
        }
      } finally {
        creatingReactions.value.splice(
          creatingReactions.value.findIndex((item) => item === reaction),
          1,
        );
      }
    };

    const enterEdit = (): void => {
      editMode.value = true;
      nextTick(() => {
        input.value?.focus();
      });
    };

    const resetEdit = (): void => {
      editMode.value = false;
      editContent.value = comment.contentRaw;
    };

    const updateComment = async (): Promise<void> => {
      try {
        if (isPending.value) return;

        if (editContent.value !== comment.contentRaw) {
          isPutingComment.value = true;

          const updatedComment = await putComment({
            commentId: comment.id,
            content: editContent.value,
          });

          console.log(updatedComment);

          if (updatedComment) {
            comments.value?.data.splice(
              comments.value?.data.findIndex(
                (item) => item.id === updatedComment.id,
              ),
              1,
              updatedComment,
            );
          }
        }

        editMode.value = false;
      } finally {
        isPutingComment.value = false;
      }
    };

    const removeComment = async (): Promise<void> => {
      try {
        if (isPending.value) return;

        // eslint-disable-next-line no-alert
        if (!window.confirm(t('deleteConfirm'))) return;

        isDeletingComment.value = true;

        const success = await deleteComment({
          commentId: comment.id,
        });

        if (success) {
          // decrease count immediately
          comments.value!.count -= 1;

          // if there are more than one comment on this page, remove the deleted comment immediately
          if (comments.value!.data.length > 1) {
            comments.value!.data.splice(
              comments.value!.data.findIndex((item) => item.id === comment.id),
              1,
            );
          }

          // if the page count should be decreased, change the query param to trigger comments reload
          if (
            query.value.page > 1 &&
            query.value.page >
              Math.ceil(comments.value!.count / query.value.perPage)
          ) {
            query.value.page -= 1;
          } else {
            await getComments();
          }
        } else {
          // this.vssue.$emit(
          //   'error',
          //   new Error(this.t('deleteFailed') as string),
          // );
        }
      } finally {
        isDeletingComment.value = false;
      }
    };

    return {
      input,

      isAdmin,

      comment,
      editMode,
      editContent,
      editInputRows,
      creatingReactions,
      isPutingComment,
      isDeletingComment,

      currentUser,
      content,
      author,
      createdAt,
      updatedAt,
      showReactions,
      reactionKeys,

      postReaction,
      enterEdit,
      resetEdit,
      updateComment,
      removeComment,

      t,
    };
  },
});
</script>
