import { computed } from 'vue';
import type { WritableComputedRef } from 'vue';

export const useLocalStorage = (
  key: string,
): WritableComputedRef<string | null> =>
  computed({
    get: () => window?.localStorage.getItem(key) ?? null,

    set: (val: string | null) => {
      if (!window) return;
      if (val === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, val);
      }
    },
  });
