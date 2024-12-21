'use client';

import { useState } from 'react';

export default function NamePrompt({ onSubmit, onClose }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      alert('נא למלא שם פרטי ושם משפחה');
      return;
    }

    try {
      const response = await fetch('/api/users/update-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (response.ok) {
        onSubmit({ firstName, lastName });
      } else {
        throw new Error('Failed to update name');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      alert('שגיאה בעדכון השם');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">עדכון פרטים אישיים</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם פרטי
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם משפחה
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#B78628] text-white rounded-md hover:bg-[#96691E]"
            >
              שמור
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 