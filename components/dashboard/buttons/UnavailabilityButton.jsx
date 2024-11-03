'use client';

import { useState } from 'react';
import SetUnavailability from '../employee/setUnavailability/SetUnavailability';

const UnavailabilityButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <button
        typeof="button"
        onClick={handleButtonClick}
        className="button-tertiary cursor-pointer relative"
      >
        Set unavailability
      </button>
      <SetUnavailability
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default UnavailabilityButton;
