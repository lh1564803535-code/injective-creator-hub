"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.02] px-8 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Something went wrong</h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500">
              {this.state.error?.message || "An unexpected error occurred. Please try again."}
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
