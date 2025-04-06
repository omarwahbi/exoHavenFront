'use client';

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">عذراً! حدث خطأ ما</h2>
          <p className="text-gray-600">يرجى تحديث الصفحة والمحاولة مرة أخرى</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 