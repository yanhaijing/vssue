<template>
  <div class="vssue-header">
    <span>
      <span class="vssue-comment-like" @click="toggleLike()">
        <VssueIcon :name="likeLoading ? 'loading' : 'like'" />
        <span class="vssue-comment-like-title">
          {{ isLiked ? '已赞' : '点赞' }}
        </span>
      </span>
      •
      <span>
        <a
          v-for="like in likes"
          :key="like.id"
          target="_blank"
          :href="like.user.web_url"
          class="vssue-comment-avatar hint--bottom"
          :aria-label="like.user.name"
        >
          <img :src="like.user.avatar_url" width="20" height="20" />
        </a>
      </span>
      <span class="vssue-comment-reaction-number">
        {{
          !vssue.user
            ? `请先登录才能点赞`
            : !vssue.issue
            ? `请先创建 Issue 才能点赞`
            : likeCount === 0
            ? `成为第一个赞同者`
            : `${likeCount}人赞同`
        }}
      </span>
    </span>
    <!-- comments-count - link to issue -->
    <a
      class="vssue-header-comments-count"
      :href="vssue.issue ? vssue.issue.link : null"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>
        {{
          vssue.comments
            ? vssue.$tc('comments', vssue.comments.count, {
                count: vssue.comments.count,
              })
            : vssue.$tc('comments', 0)
        }}
      </span>
    </a>

    <!-- powered-by - platform and vssue -->
    <span class="vssue-header-powered-by">
      <span>Powered by</span>

      <span v-if="vssue.API">
        <a
          :href="vssue.API.platform.link"
          :title="
            `${vssue.API.platform.name} API ${vssue.API.platform.version}`
          "
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ vssue.API.platform.name }}
        </a>

        <span>&</span>
      </span>

      <a
        href="https://github.com/meteorlxy/vssue"
        :title="`Vssue v${vssue.version}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        Vssue
      </a>
    </span>
  </div>
</template>

<style>
.vssue-comment-like {
  cursor: pointer;
}
.vssue-comment-like .vssue-icon-like {
  font-size: 22px;
}
.vssue-comment-like-title {
  color: #3eaf7c;
}
.vssue-header-comments-count {
  float: right;
}
.vssue-header-powered-by {
  display: none;
}
.vssue-comment-avatar {
  display: inline-block;
  margin-left: 3px;
  line-height: 20px;
}
.vssue-comment-avatar img {
  border-radius: 50%;
  vertical-align: bottom;
}
.vssue .vssue-header {
  overflow: visible;
}
</style>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import { Vssue } from 'vssue';
import VssueIcon from './VssueIcon.vue';

@Component({
  components: {
    VssueIcon,
  },
})
export default class VssueHeader extends Vue {
  @Inject() vssue!: Vssue.Store;

  get likes() {
    return (this.vssue.issueAwardEmoji ?? []).filter(
      item => item.name === 'thumbsup'
    );
  }

  get likeCount(): number {
    return this.likes.length;
  }

  get myLike() {
    return this.vssue.issueAwardEmoji?.find(
      item =>
        item.name === 'thumbsup' &&
        item.user.username === this.vssue.user?.username
    );
  }

  get isLiked() {
    return !!this.myLike;
  }

  likeLoading = false;

  toggleLike() {
    if (!this.vssue.user) {
      if (window.confirm('点赞需要登录，点击确定即将跳转登录页面')) {
        this.vssue.login();
      }
      return;
    }
    if (!this.vssue.issue) {
      return;
    }
    this.likeLoading = true;
    if (this.isLiked) {
      this.vssue.API.deleteIssueAwardEmoji({
        accessToken: this.vssue.accessToken,
        issueId: this.vssue.issue?.id,
        emojId: this.myLike?.id,
      })
        .then(() => {
          return this.vssue.initIssueAwardEmoji();
        })
        .then(
          () => {
            this.likeLoading = false;
          },
          () => {
            this.likeLoading = false;
          }
        );
    } else {
      this.vssue.API.postIssueAwardEmoji({
        accessToken: this.vssue.accessToken,
        issueId: this.vssue.issue?.id,
        name: 'thumbsup',
      })
        .then(() => {
          return this.vssue.initIssueAwardEmoji();
        })
        .then(
          () => {
            this.likeLoading = false;
            this.vssue.initIssueAwardEmoji();
          },
          () => {
            this.likeLoading = false;
          }
        );
    }
  }
}
</script>
