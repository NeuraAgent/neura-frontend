import { authService } from '@/services/authService';
import { oidcService } from '@/services/oidcService';
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/types';

import { UserMapper } from './userMapper';

export class AuthInitializer {
  static async initialize(): Promise<{
    user: User | null;
  }> {
    try {
      const persistedUser = useUserStore.getState().user;

      const oauthUser = await oidcService.getUser();
      if (oauthUser && !oauthUser.expired) {
        // With cookie-based auth, user data comes from userStore (populated from cookies)
        const user = UserMapper.fromOAuth(
          oauthUser,
          persistedUser,
          persistedUser
        );
        return { user };
      }

      // With cookie-based auth, user data comes from userStore (populated from cookies)
      if (persistedUser) {
        const user = UserMapper.mergeWithPersisted(
          persistedUser,
          persistedUser
        );
        return { user };
      }

      return { user: null };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      await authService.logout();
      await oidcService.removeUser();
      return { user: null };
    }
  }
}
