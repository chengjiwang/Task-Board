'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-200">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700">
          Something went wrong
        </h2>
        <p className="text-gray-500">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={reset}
            className="px-6 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
