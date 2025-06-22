import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addMedication } from '../api';

const AddMedicationForm = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const addMedicationMutation = useMutation(addMedication, {
    onSuccess: () => {
      queryClient.invalidateQueries(['medications']); // Invalidate cache to refetch
      setName('');
      setDosage('');
      setFrequency('');
      setFormError('');
      setSuccessMessage('Medication added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
    },
    onError: (error) => {
      console.error('Error adding medication:', error);
      setFormError(error.message || 'Failed to add medication.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!name.trim() || !dosage.trim() || !frequency.trim()) {
      setFormError('All fields are required.');
      return;
    }

    addMedicationMutation.mutate({ name, dosage, frequency });
  };

  return (
    <div className="bg-purple-800 p-8 rounded-xl shadow-2xl border border-purple-700 w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-pink-300 mb-6 text-center">Add New Medication</h2>

      {successMessage && (
        <p className="text-green-300 text-center mb-4 bg-green-800 p-3 rounded-md">
          {successMessage}
        </p>
      )}
      {formError && (
        <p className="text-red-300 text-center mb-4 bg-red-800 p-3 rounded-md">
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-purple-200 text-sm font-semibold mb-2" htmlFor="name">
            Medication Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => { setName(e.target.value); setFormError(''); }}
            className="w-full p-3 rounded-lg bg-purple-700 text-white border border-purple-600 focus:border-pink-500 outline-none transition-colors duration-200"
            placeholder="e.g., Ibuprofen"
            disabled={addMedicationMutation.isLoading}
          />
        </div>

        <div>
          <label className="block text-purple-200 text-sm font-semibold mb-2" htmlFor="dosage">
            Dosage
          </label>
          <input
            type="text"
            id="dosage"
            value={dosage}
            onChange={(e) => { setDosage(e.target.value); setFormError(''); }}
            className="w-full p-3 rounded-lg bg-purple-700 text-white border border-purple-600 focus:border-pink-500 outline-none transition-colors duration-200"
            placeholder="e.g., 200mg, 1 tablet"
            disabled={addMedicationMutation.isLoading}
          />
        </div>

        <div>
          <label className="block text-purple-200 text-sm font-semibold mb-2" htmlFor="frequency">
            Frequency
          </label>
          <input
            type="text"
            id="frequency"
            value={frequency}
            onChange={(e) => { setFrequency(e.target.value); setFormError(''); }}
            className="w-full p-3 rounded-lg bg-purple-700 text-white border border-purple-600 focus:border-pink-500 outline-none transition-colors duration-200"
            placeholder="e.g., Once a day, Every 8 hours"
            disabled={addMedicationMutation.isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-pink-700 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center space-x-2"
          disabled={addMedicationMutation.isLoading}
        >
          {addMedicationMutation.isLoading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          <span>Add Medication</span>
        </button>
      </form>
    </div>
  );
};

export default AddMedicationForm;