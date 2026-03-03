import { authService } from '@/services/authService';
import { oidcService } from '@/services/oidcService';
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/types';

import { UserMapper } from './userMapper';

export class AuthInitializer {
  static async initialize(): Promise<{
    user: User | null;
    token: string | null;
  }> {
    try {
      const persistedUser = useUserStore.getState().user;

      const oauthUser = await oidcService.getUser();
      if (oauthUser && !oauthUser.expired) {
        const storedUser = authService.getCurrentUser();
        const user = UserMapper.fromOAuth(oauthUser, storedUser, persistedUser);
        return { user, token: oauthUser.access_token };
      }

      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        const user = UserMapper.mergeWithPersisted(storedUser, persistedUser);
        return { user, token: 'authenticated' };
      }

      return { user: null, token: null };
    } catch (error) {
      console.error('Auth initialization error:', error);
      await authService.logout();
      await oidcService.removeUser();
      return { user: null, token: null };
    }
  }
}
