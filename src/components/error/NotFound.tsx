import { Home, ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4">
      <div className="max-w-md w-full text-center px-2">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold text-gray-300">
            404
          </h1>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          Page Not Found
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The
          page might have been moved, deleted, or you might have entered the
          wrong URL.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
