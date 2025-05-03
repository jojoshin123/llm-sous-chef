import React from 'react';

interface UserSelectModalProps {
  onClose: () => void;
  onCancel: () => void;
  cookbookId: string;
}

const UserSelectModal: React.FC<UserSelectModalProps> = ({ onClose, onCancel, cookbookId }) => {
  const [newUser, setNewUser] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser) return;

    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/recipes/share-cookbook`, {
        method: 'POST',
        headers: {
          "Authorization": 'Bearer ' + token,
          "new-user": newUser,
          "cookbook-id": cookbookId
        }
      });

      if (!response.ok) {
        throw new Error('Error sharing cookbook');
      }

      onClose();

    }catch(err) {
      setError('Error sharing cookbook. Please try again.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold text-papyrus-800 mb-4">Share with friends</h2>
        <p className="text-gray-700 mb-6">
          Enter the username or email of the user you'd like to share this cookbook with:
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              id="newUser"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-papyrus-300 focus:border-papyrus-500 focus:ring-0"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-papyrus-800 text-papyrus-50 rounded hover:bg-papyrus-900 transition"
              >
                Share
              </button>
            </div>
          </form>
          {error && (
            <div className="my-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
      </div>
    </div>
  );
};

export default UserSelectModal;