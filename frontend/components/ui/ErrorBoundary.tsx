"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
    children: React.ReactNode;
    sectionName?: string;
    fallback?: (error: Error) => React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Reusable React Error Boundary.
 *
 * Wraps any section or page so a single crash doesn't take down the whole UI.
 * In development the error message is shown; in production a clean notice is shown.
 */
export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        if (process.env.NODE_ENV === "development") {
            console.error(`[ErrorBoundary][${this.props.sectionName ?? "Section"}]`, error, info);
        }
    }

    private handleReset = () => this.setState({ hasError: false, error: null });

    render() {
        if (!this.state.hasError) return this.props.children;

        if (this.props.fallback && this.state.error) {
            return this.props.fallback(this.state.error);
        }

        const isDev = process.env.NODE_ENV === "development";
        const label = this.props.sectionName ?? "Section";

        return (
            <div className="py-8 px-6 my-2 rounded-xl border border-amber-200 bg-amber-50 max-w-xl mx-auto text-center">
                <div className="flex justify-center mb-3">
                    <div className="p-2 bg-amber-100 rounded-full">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                </div>
                <p className="text-sm font-semibold text-amber-800 mb-1">
                    The &quot;{label}&quot; section could not be displayed.
                </p>
                <p className="text-xs text-amber-600 mb-4">
                    Please refresh the page or contact support if the issue persists.
                </p>
                {isDev && this.state.error && (
                    <pre className="mb-4 text-left text-[10px] text-red-700 bg-red-50 border border-red-200 rounded p-3 overflow-auto max-h-32">
                        {this.state.error.message}
                    </pre>
                )}
                <button
                    onClick={this.handleReset}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-lg transition"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        );
    }
}
