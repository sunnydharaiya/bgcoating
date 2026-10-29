// src/components/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled component error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && (prevProps.resetKey !== this.props.resetKey || prevProps.children !== this.props.children)) {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.handleReset
        });
      }

      return (
        <div className="min-h-[300px] flex items-center justify-center p-6 bg-slate-900/40 rounded-3xl border border-red-500/20 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {this.props.title || 'Component Render Interrupted'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                An unexpected event occurred while rendering this section. You can reload this component safely.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-left">
                <p className="text-[11px] font-mono font-bold text-red-700 dark:text-red-400 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reload Component
              </button>

              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
