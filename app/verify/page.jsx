import ErrorBoundary from '@/components/ErrorBoundary';
import SetPassword from '@/components/setPassword';
import React from 'react';

const setPasswordPage = () => {
  return (
    <div>
      <ErrorBoundary>
        <SetPassword />
      </ErrorBoundary>
    </div>
  );
};

export default setPasswordPage;
