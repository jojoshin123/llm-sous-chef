import React from 'react';

interface ConfirmationModalProps {
  message: string;
  titleText: string;
  closeText: string;
  onClose: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, titleText, closeText, onClose, onCancel }) => {

  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold text-papyrus-800 mb-4">{titleText}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-papyrus-800 text-papyrus-50 rounded hover:bg-papyrus-900 transition"
            >
              {closeText}
            </button>
          </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;