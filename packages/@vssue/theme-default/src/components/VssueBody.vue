<template>
  <!-- initialized -->
  <div v-if="!isInitializing" class="vssue-body">
    <VssueNewComment />

    <!-- notice - alert and progress -->
    <!-- <VssueNotice /> -->

    <!-- comments - list and pagination -->
    <VssueComments v-if="comments && comments.data.length > 0" />

    <VssueStatus v-else />
  </div>

  <VssueStatus v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@vssue/core';
import TransitionFade from './TransitionFade';
import VssueComments from './VssueComments.vue';
import VssueNewComment from './VssueNewComment.vue';
// import VssueNotice from './VssueNotice.vue';
import VssueStatus from './VssueStatus.vue';

export default defineComponent({
  name: 'VssueBody',

  components: {
    TransitionFade,
    VssueComments,
    VssueNewComment,
    // VssueNotice,
    VssueStatus,
  },

  setup() {
    const { comments, isInitializing } = useStore();

    return {
      comments,
      isInitializing,
    };
  },
});
</script>
