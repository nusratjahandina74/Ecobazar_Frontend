import { Component } from "react";

export default class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        if (import.meta.env.DEV) console.error("[ErrorBoundary]", error);
    }

    render() {
        if (!this.state.hasError) return this.props.children;
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-6">
                <div className="text-center max-w-sm">
                    <p className="font-display text-2xl font-semibold text-forest">Something went wrong</p>
                    <p className="text-sm text-slate mt-2">An unexpected error occurred. Please reload the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-5 px-5 py-2.5 rounded-lg bg-leaf text-white text-sm font-semibold hover:bg-leaf-dark transition-colors"
                    >
                        Reload
                    </button>
                </div>
            </div>
        );
    }
}
