'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-primary-black text-secondary-white">
          <div className="text-center p-8">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-red rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠</span>
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">
                Something went wrong
              </h2>
              <p className="text-secondary-lightGray mb-6">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-red hover:bg-primary-darkRed rounded-lg transition-colors duration-300"
            >
              Refresh Page
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-secondary-lightGray">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-4 bg-primary-darkGray rounded text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;