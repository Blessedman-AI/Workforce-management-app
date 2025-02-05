'use client';
import React, { useState } from 'react';

// Simple Error UI Component
const ErrorFallback = ({ error, resetError, description }) => {
  return (
    <div className="px-4 py-4 m-4 flex items-center justify-center bg-gray-100 rounded-lg border">
      <h3 className="text-lg font-semibold text-black-1">
        Oops! Something went wrong
      </h3>
      <p className="mt-2 text-red-600">{description}</p>
      {/* <button
        onClick={resetError}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try Again
      </button> */}
    </div>
  );
};

// Simplified Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log to error reporting service
    console.error(`${this.props.description} error:`, error, info);
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          resetError={this.resetError}
          description={this.props.description}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
