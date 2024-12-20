'use client';

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-red-600 mb-4">משהו השתבש</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-[#B78628] hover:text-[#96691E]"
          >
            נסה שוב
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 