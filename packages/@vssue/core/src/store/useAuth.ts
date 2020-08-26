import { ref, computed } from 'vue';
import type { ComputedRef } from 'vue';
import { useLocalStorage } from '@vssue/utils';
import type { VssueStore, VssueAPI, VssueOptions } from '../types';

/**
 * Handle authorization
 */
export const useAuth = ({
  vssueOptions,
  vssueAPI,
}: {
  vssueOptions: VssueOptions;
  vssueAPI: VssueAPI.VssueAPI;
}): {
  accessToken: ComputedRef<string | null>;
  handleAuth: () => Promise<void>;
} & Pick<VssueStore, 'user' | 'login' | 'logout' | 'isLogin' | 'isAdmin'> => {
  // user access token
  const accessToken = useLocalStorage(
    `Vssue.${vssueAPI.platform.name.toLowerCase()}.access_token`,
  );

  // user info
  const user: VssueStore['user'] = ref(null);

  // login function
  const login: VssueStore['login'] = () => {
    vssueAPI.redirectAuth();
  };

  // logout function
  const logout: VssueStore['logout'] = () => {
    accessToken.value = null;
    user.value = null;
  };

  // flags
  const isLogin: VssueStore['isLogin'] = computed(() => user.value !== null);
  const isAdmin: VssueStore['isAdmin'] = computed(
    () =>
      user.value !== null &&
      (vssueOptions.owner === user.value.username ||
        vssueOptions.admins.includes(user.value.username)),
  );

  // handle authorization
  const handleAuth = async (): Promise<void> => {
    // get new access token from api
    const newAccessToken = await vssueAPI.handleAuth();

    if (newAccessToken !== null) {
      // use new access token
      accessToken.value = newAccessToken;
    }

    if (accessToken.value !== null) {
      // get user from api
      user.value = await vssueAPI.getUser({ accessToken: accessToken.value });
    }
  };

  return {
    accessToken,
    handleAuth,
    user,
    login,
    logout,
    isLogin,
    isAdmin,
  };
};
