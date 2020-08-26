<template>
  <div class="vssue-pagination">
    <div class="vssue-pagination-per-page">
      <label>
        <select
          v-model="perPage"
          class="vssue-pagination-select"
          :disabled="disabled"
        >
          <option v-for="val in perPageOptions" :key="val" :value="val">
            {{ val }}
          </option>
        </select>

        <span v-text="` ${t('perPage')}`" />
      </label>

      <span
        v-if="vssueAPI.platform.meta.sortable"
        :class="{
          'vssue-pagination-link': true,
          'disabled': disabled,
        }"
        :title="t('sort')"
        @click="query.sort = query.sort === 'asc' ? 'desc' : 'asc'"
      >
        {{ query.sort === 'asc' ? `↑` : `↓` }}
      </span>
    </div>

    <div class="vssue-pagination-page">
      <span
        :class="{
          'vssue-pagination-link': true,
          'disabled': page === 1 || disabled,
        }"
        :title="t('prev')"
        @click="page -= 1"
        v-text="`<`"
      />

      <label>
        <span v-text="`${t('page')} `" />

        <select
          v-show="pageCount > 1"
          v-model="page"
          class="vssue-pagination-select"
          :disabled="disabled"
        >
          <option v-for="val in pageCount" :key="val" :value="val">
            {{ val }}
          </option>
        </select>

        <span v-show="pageCount < 2" v-text="page" />

        <span v-text="`/ ${pageCount}`" />
      </label>

      <span
        :class="{
          'vssue-pagination-link': true,
          'disabled': page === pageCount || disabled,
        }"
        :title="t('next')"
        @click="page += 1"
        v-text="`>`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '@vssue/core';
import VssueIcon from './VssueIcon';

export default defineComponent({
  name: 'VssuePagination',

  components: {
    VssueIcon,
  },

  setup() {
    const { vssueOptions, vssueAPI, comments, query, isPending } = useStore();

    const { t } = useI18n();

    const disabled = computed(() => isPending.value);

    const pageCount = computed(() => {
      const count = Math.ceil(comments.value!.count / comments.value!.perPage);
      return count > 1 ? count : 1;
    });

    const perPageOptions = computed(() => {
      const options: Array<number> = [5, 10, 20, 50];
      if (
        !options.includes(vssueOptions.perPage) &&
        vssueOptions.perPage < 100
      ) {
        options.push(vssueOptions.perPage);
      }
      return options.sort((a, b) => a - b);
    });

    const page = computed<number>({
      get() {
        return query.value.page > pageCount.value
          ? pageCount.value
          : query.value.page;
      },
      set(val) {
        if (val > 0 && val <= pageCount.value) {
          query.value.page = val;
        }
      },
    });

    const perPage = computed<number>({
      get() {
        return query.value.perPage;
      },
      set(val) {
        if (perPageOptions.value.includes(val)) {
          query.value.perPage = val;
        }
      },
    });

    return {
      vssueAPI,
      disabled,
      pageCount,
      perPageOptions,
      page,
      perPage,
      t,
    };
  },
});
</script>
