import React from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel, isLoading, error }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-purple-800 p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
        <h3 className="text-2xl font-bold text-white mb-6">Confirm Action</h3>
        <p className="text-purple-200 mb-6">{message}</p>

        {error && <p className="text-red-300 text-sm mb-4">{error}</p>}

        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;