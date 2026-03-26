import React, { useEffect } from 'react';

import { oidcService } from '@/services/oidcService';

/**
 * Silent Callback component for handling silent token renewal
 * This component is loaded in a hidden iframe for automatic token refresh
 */
const SilentCallback: React.FC = () => {
  useEffect(() => {
    const handleSilentCallback = async () => {
      try {
        await oidcService.signinSilentCallback();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        /* empty */
      }
    };

    handleSilentCallback();
  }, []);

  return <div style={{ display: 'none' }}>Silent callback processing...</div>;
};

export default SilentCallback;
