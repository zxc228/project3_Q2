import React from 'react';

const FeatureComingSoon = ({ isOpen, onClose, featureName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg text-center w-96">
        <h2 className="text-xl font-semibold mb-4">Oops!</h2>
        <p className="text-lg">The "{featureName}" feature is not ready yet.</p>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-custom-utad-logo text-white rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FeatureComingSoon;
