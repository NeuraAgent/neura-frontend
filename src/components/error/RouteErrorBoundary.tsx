import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

import ErrorPage from './ErrorPage';
import NotFound from './NotFound';

const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();

  // Handle different types of route errors
  if (isRouteErrorResponse(error)) {
    // Handle HTTP errors (404, 500, etc.)
    switch (error.status) {
      case 404:
        return <NotFound />;
      case 401:
        return (
          <ErrorPage
            statusCode={401}
            title="Unauthorized"
            message="You don't have permission to access this page. Please log in and try again."
            showRetry={false}
          />
        );
      case 403:
        return (
          <ErrorPage
            statusCode={403}
            title="Forbidden"
            message="You don't have permission to access this resource."
            showRetry={false}
          />
        );
      case 500:
        return (
          <ErrorPage
            statusCode={500}
            title="Internal Server Error"
            message="Something went wrong on our end. Please try again later."
          />
        );
      default:
        return (
          <ErrorPage
            statusCode={error.status}
            title={error.statusText || 'Error'}
            message={error.data?.message || 'An unexpected error occurred.'}
          />
        );
    }
  }

  // Handle JavaScript errors
  if (error instanceof Error) {
    return (
      <ErrorPage
        title="Application Error"
        message={
          import.meta.env.DEV
            ? error.message
            : 'An unexpected error occurred. Please try again.'
        }
      />
    );
  }

  // Handle unknown errors
  return (
    <ErrorPage
      title="Unknown Error"
      message="An unexpected error occurred. Please try again."
    />
  );
};

export default RouteErrorBoundary;
