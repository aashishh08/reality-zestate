/**
 * React Error Boundary Component
 * Catches runtime errors and displays a fallback UI
 * Prevents entire app from crashing due to component errors
 */

'use client';

import React, { ReactNode, Component, ErrorInfo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component for catching React component errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);

    this.setState({
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="w-full min-h-screen flex items-center justify-center bg-zinc-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-black mb-2">
              Oops! Something went wrong
            </h1>

            <p className="text-center text-zinc-600 mb-6">
              We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-xs font-mono text-red-800 overflow-auto max-h-32">
                <p className="font-bold mb-2">Error Details:</p>
                <p>{this.state.error.message}</p>
                {this.state.errorInfo && (
                  <div className="mt-2 text-xs">
                    <p className="font-bold">Component Stack:</p>
                    <pre className="text-[10px] whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-black font-bold py-3 px-6 rounded transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>

            <a
              href="/"
              className="block w-full text-center mt-3 text-zinc-600 hover:text-black transition-colors"
            >
              Go to Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error Boundary for specific components/sections
 * Lighter fallback for non-critical sections
 */
export function SectionErrorBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}): ReactNode {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="w-full p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  This section encountered an error
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  Please refresh the page to try again.
                </p>
              </div>
            </div>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}
