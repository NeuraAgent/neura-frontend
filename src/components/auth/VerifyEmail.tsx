import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { API_GATEWAY_ENDPOINTS } from '@/constants/apiEndpoints';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { apiClient } from '@/utils/apiClient';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await apiClient.get(
          `${API_GATEWAY_ENDPOINTS.AUTH}/verify-email?token=${token}`
        );

        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message || 'Email verified successfully!');
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/neura/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Verification failed');
        }
      } catch (error: any) {
        const errorMessage = handleError(error, {
          showToast: false,
          defaultMessage: 'An error occurred during verification',
        });

        if (errorMessage) {
          setStatus('error');
          setMessage(errorMessage);
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-6 px-3 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4 sm:space-y-8 text-center px-2">
        {status === 'loading' && (
          <>
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Đang xác thực email...
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Vui lòng đợi trong giây lát
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Xác thực thành công!
            </h2>
            <p className="text-sm sm:text-base text-gray-600">{message}</p>
            <p className="text-xs sm:text-sm text-gray-500">
              Đang chuyển hướng đến trang đăng nhập...
            </p>
            <Link
              to="/neura/login"
              className="inline-block mt-3 sm:mt-4 text-sm sm:text-base text-gray-900 hover:text-gray-700 font-medium"
            >
              Đăng nhập ngay →
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Xác thực thất bại
            </h2>
            <p className="text-sm sm:text-base text-gray-600">{message}</p>
            <div className="space-y-2 mt-3 sm:mt-4">
              <Link
                to="/neura/signup"
                className="block text-sm sm:text-base text-gray-900 hover:text-gray-700 font-medium"
              >
                Đăng ký lại →
              </Link>
              <Link
                to="/neura/login"
                className="block text-sm sm:text-base text-gray-600 hover:text-gray-700"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
