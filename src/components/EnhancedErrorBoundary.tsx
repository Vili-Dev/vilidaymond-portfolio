'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  eventId?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolate?: boolean; // If true, only catches errors from direct children
  name?: string; // Boundary name for debugging
}

class EnhancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const eventId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      eventId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Log error details
    const errorReport = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      boundaryName: this.props.name || 'Unknown',
      retryCount: this.retryCount
    };

    console.error('Enhanced Error Boundary caught an error:', errorReport);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Send to error reporting service (if implemented)
    this.reportError(errorReport);
  }

  private reportError = async (errorReport: any) => {
    try {
      // In a real app, you'd send this to your error reporting service
      // e.g., Sentry, LogRocket, Bugsnag, etc.
      
      // For now, just store in localStorage for debugging
      const existingReports = JSON.parse(
        localStorage.getItem('vilidaymond_error_reports') || '[]'
      );
      
      existingReports.push(errorReport);
      
      // Keep only last 10 reports
      if (existingReports.length > 10) {
        existingReports.shift();
      }
      
      localStorage.setItem(
        'vilidaymond_error_reports', 
        JSON.stringify(existingReports)
      );
    } catch (storageError) {
      console.error('Failed to store error report:', storageError);
    }
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }
  };

  private handleReset = () => {
    this.retryCount = 0;
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.retryCount < this.maxRetries;
      const isNetworkError = this.state.error?.message?.includes('fetch') ||
                           this.state.error?.message?.includes('network') ||
                           this.state.error?.message?.includes('Loading');

      return (
        <div className="min-h-96 flex items-center justify-center p-8">
          <div className="max-w-md text-center glass-effect rounded-lg p-8">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-red/20 rounded-full flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-primary-red" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              
              <h2 className="font-display text-xl font-bold text-secondary-white mb-2">
                {isNetworkError ? 'Connection Issue' : 'Something Went Wrong'}
              </h2>
              
              <p className="text-secondary-lightGray text-sm mb-6">
                {isNetworkError 
                  ? 'Unable to load content. Please check your connection and try again.'
                  : 'We encountered an unexpected error. This has been logged and will be investigated.'
                }
              </p>

              {this.retryCount > 0 && (
                <p className="text-xs text-secondary-lightGray mb-4">
                  Retry attempt: {this.retryCount}/{this.maxRetries}
                </p>
              )}
            </div>
            
            <div className="flex gap-3 justify-center">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="px-4 py-2 bg-primary-red hover:bg-primary-darkRed text-white text-sm rounded-lg transition-colors duration-300 hover-optimized"
                  data-audio-click
                >
                  Try Again
                </button>
              )}
              
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-secondary-gray hover:bg-secondary-lightGray text-white text-sm rounded-lg transition-colors duration-300 hover-optimized"
                data-audio-click
              >
                Reset
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-secondary-gray hover:border-secondary-lightGray text-secondary-white hover:text-white text-sm rounded-lg transition-colors duration-300 hover-optimized"
                data-audio-click
              >
                Reload Page
              </button>
            </div>

            {/* Error ID for support */}
            {this.state.eventId && (
              <p className="text-xs text-secondary-lightGray mt-4 font-mono">
                Error ID: {this.state.eventId}
              </p>
            )}
            
            {/* Development details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-secondary-lightGray text-sm hover:text-secondary-white transition-colors">
                  Technical Details (Dev Mode)
                </summary>
                <div className="mt-3 p-3 bg-primary-darkGray rounded text-xs overflow-auto">
                  <div className="mb-2">
                    <strong className="text-primary-red">Error:</strong>
                    <div className="text-secondary-white mt-1">{this.state.error.message}</div>
                  </div>
                  
                  {this.state.errorInfo?.componentStack && (
                    <div className="mb-2">
                      <strong className="text-primary-red">Component Stack:</strong>
                      <pre className="text-secondary-lightGray mt-1 text-xs whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                  
                  {this.state.error.stack && (
                    <div>
                      <strong className="text-primary-red">Stack Trace:</strong>
                      <pre className="text-secondary-lightGray mt-1 text-xs whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => {
    return (
      <EnhancedErrorBoundary {...errorBoundaryProps} name={Component.displayName || Component.name}>
        <Component {...props} />
      </EnhancedErrorBoundary>
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Lightweight error boundary for specific features
export function FeatureErrorBoundary({ 
  children, 
  feature 
}: { 
  children: ReactNode; 
  feature: string 
}) {
  return (
    <EnhancedErrorBoundary
      name={`${feature}FeatureBoundary`}
      fallback={
        <div className="p-4 border border-secondary-gray/30 rounded-lg bg-primary-darkGray/50">
          <p className="text-secondary-lightGray text-sm">
            {feature} is temporarily unavailable
          </p>
        </div>
      }
    >
      {children}
    </EnhancedErrorBoundary>
  );
}

export default EnhancedErrorBoundary;