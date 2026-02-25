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
      } catch (error) {
        console.error('Silent callback error:', error);
      }
    };

    handleSilentCallback();
  }, []);

  return <div style={{ display: 'none' }}>Silent callback processing...</div>;
};

export default SilentCallback;
