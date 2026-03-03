import type { User } from '@/types';

import type { OAuthUser } from './types';

export class UserMapper {
  static fromOAuth(
    oauthUser: OAuthUser,
    storedUser: User | null,
    persistedUser: User | null
  ): User {
    const profile = oauthUser.profile;

    return {
      id: storedUser?.id || profile.sub || profile.id || profile.email || '',
      firstName:
        storedUser?.firstName || profile.given_name || profile.firstName || '',
      lastName:
        storedUser?.lastName || profile.family_name || profile.lastName || '',
      email: storedUser?.email || profile.email || '',
      phoneNumber: storedUser?.phoneNumber || profile.phoneNumber || '',
      isEmailVerified:
        storedUser?.isEmailVerified ??
        profile.email_verified ??
        profile.isEmailVerified ??
        false,
      roles: storedUser?.roles || profile.roles || ['user'],
      isActive: storedUser?.isActive ?? profile.isActive ?? true,
      createdAt:
        storedUser?.createdAt || profile.createdAt || new Date().toISOString(),
      updatedAt:
        storedUser?.updatedAt || profile.updatedAt || new Date().toISOString(),
      provider: (storedUser?.provider || profile.provider || 'google') as
        | 'local'
        | 'google'
        | 'oauth',
      providerId: storedUser?.providerId || profile.providerId || profile.sub,
      picture: storedUser?.picture || profile.picture,
      hasCompletedIntro:
        persistedUser?.hasCompletedIntro ??
        storedUser?.hasCompletedIntro ??
        profile.hasCompletedIntro ??
        false,
      preferredLanguage:
        storedUser?.preferredLanguage || profile.preferredLanguage || 'vi',
    };
  }

  static mergeWithPersisted(
    storedUser: User,
    persistedUser: User | null
  ): User {
    return {
      ...storedUser,
      hasCompletedIntro:
        persistedUser?.hasCompletedIntro ??
        storedUser?.hasCompletedIntro ??
        false,
    };
  }
}
