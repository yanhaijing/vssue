<template>
  <div class="vssue-comments">
    <!-- pagination top -->
    <VssuePagination />

    <!-- list of comments -->
    <TransitionFade group>
      <VssueComment
        v-for="comment in comments.data"
        :key="comment.id"
        :comment="comment"
      />
    </TransitionFade>

    <!-- pagination bottom - if too many comments -->
    <VssuePagination v-show="comments.data.length > 5" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@vssue/core';
import TransitionFade from './TransitionFade';
import VssueComment from './VssueComment.vue';
import VssuePagination from './VssuePagination.vue';

export default defineComponent({
  name: 'VssueComments',

  components: {
    TransitionFade,
    VssueComment,
    VssuePagination,
  },

  setup() {
    const { comments } = useStore();

    return {
      comments,
    };
  },
});
</script>
