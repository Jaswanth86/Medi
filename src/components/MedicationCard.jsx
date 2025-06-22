import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { markMedicationAsTaken, deleteMedication, updateMedication } from '../api';
import { format, parseISO } from 'date-fns';
import ConfirmationModal from './ConfirmationModal'; // You'll create this

const MedicationCard = ({ medication, logs, onLogUpdated }) => {
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(medication.name);
  const [editDosage, setEditDosage] = useState(medication.dosage);
  const [editFrequency, setEditFrequency] = useState(medication.frequency);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [editError, setEditError] = useState('');

  const markTakenMutation = useMutation(markMedicationAsTaken, {
    onSuccess: (data, variables) => {
      // Invalidate queries to refetch medications
      queryClient.invalidateQueries(['medications']);
      // Call prop function to update parent's state for logs if needed
      if (onLogUpdated) {
        onLogUpdated(medication.id, variables.date, variables.taken);
      }
    },
    onError: (error) => {
      console.error('Error marking medication:', error);
      alert(`Failed to update medication status: ${error.message || 'Unknown error'}`);
    },
  });

  const deleteMedicationMutation = useMutation(deleteMedication, {
    onSuccess: () => {
      queryClient.invalidateQueries(['medications']);
      setShowDeleteConfirm(false);
      setDeleteError('');
    },
    onError: (error) => {
      console.error('Error deleting medication:', error);
      setDeleteError(`Failed to delete medication: ${error.message || 'Unknown error'}`);
    },
  });

  const updateMedicationMutation = useMutation(updateMedication, {
    onSuccess: () => {
      queryClient.invalidateQueries(['medications']);
      setShowEditModal(false);
      setEditError('');
    },
    onError: (error) => {
      console.error('Error updating medication:', error);
      setEditError(`Failed to update medication: ${error.message || 'Unknown error'}`);
    },
  });

  const handleMarkTaken = (date, isTaken) => {
    markTakenMutation.mutate({
      medicationId: medication.id,
      date,
      taken: isTaken ? 1 : 0,
    });
  };

  const handleDelete = () => {
    deleteMedicationMutation.mutate(medication.id);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editDosage.trim() || !editFrequency.trim()) {
      setEditError('All fields are required.');
      return;
    }
    updateMedicationMutation.mutate({
      medicationId: medication.id,
      name: editName,
      dosage: editDosage,
      frequency: editFrequency,
    });
  };

  // Get today's date in YYYY-MM-DD format
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLog = logs.find((log) => log.date === today);
  const isTakenToday = todayLog ? todayLog.taken === 1 : false;

  // Calculate local adherence (based on logs provided)
  const totalLoggedAttempts = logs.length;
  const countTakenLogs = logs.filter((log) => log.taken === 1).length;
  const adherencePercentage = totalLoggedAttempts > 0 ? (countTakenLogs / totalLoggedAttempts) * 100 : 0;

  return (
    <div className="bg-purple-700 p-6 rounded-xl shadow-lg border border-purple-600 transform transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-bold text-pink-300 mb-2">{medication.name}</h3>
        <p className="text-purple-200">
          <span className="font-semibold">Dosage:</span> {medication.dosage}
        </p>
        <p className="text-purple-200 mb-4">
          <span className="font-semibold">Frequency:</span> {medication.frequency}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-purple-200 text-sm">Taken Today:</span>
          <button
            onClick={() => handleMarkTaken(today, !isTakenToday)}
            className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-300 ${
              isTakenToday
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
            disabled={markTakenMutation.isLoading}
          >
            {markTakenMutation.isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">...</svg>
                Updating...
              </span>
            ) : (
              (isTakenToday ? 'Yes' : 'No')
            )}
          </button>
        </div>

        <div className="mb-4">
          <span className="text-purple-200 text-sm">Adherence: </span>
          <span className="font-bold text-pink-300">{adherencePercentage.toFixed(1)}%</span>
        </div>

        {todayLog && todayLog.proof_photo_path && (
            <div className="mb-4">
                <p className="text-purple-200 text-sm mb-2">Proof Photo:</p>
                <img
                    src={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}${todayLog.proof_photo_path}`}
                    alt="Medication Proof"
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                    onError={(e) => { e.target.onerror = null; e.target.src="[https://placehold.co/300x200/522B5B/F3C1F3?text=Image+Error](https://placehold.co/300x200/522B5B/F3C1F3?text=Image+Error)"; }}
                />
            </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => setShowEditModal(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Delete
        </button>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-purple-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-white mb-6">Edit Medication</h3>
            {editError && <p className="text-red-300 text-sm mb-4">{editError}</p>}
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2" htmlFor="editName">
                  Name
                </label>
                <input
                  type="text"
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-purple-700 text-white border border-purple-600 focus:border-pink-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2" htmlFor="editDosage">
                  Dosage
                </label>
                <input
                  type="text"
                  id="editDosage"
                  value={editDosage}
                  onChange={(e) => setEditDosage(e.target.value)}
                  className="w-full p-3 rounded-lg bg-purple-700 text-white border border-purple-600 focus:border-pink-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2" htmlFor="editFrequency">
                  Frequency
                </label>
                <input
                  type="text"
                  id="editFrequency"
                  value={editFrequency}
                  onChange={(e) => setEditFrequency(e.target.value)}
                  className="w-full p-3 rounded-lg bg-purple-700 text-white border border-purple-600 focus:border-pink-500 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditError(''); }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-200"
                  disabled={updateMedicationMutation.isLoading}
                >
                  {updateMedicationMutation.isLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <ConfirmationModal
          message="Are you sure you want to delete this medication? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => { setShowDeleteConfirm(false); setDeleteError(''); }}
          isLoading={deleteMedicationMutation.isLoading}
          error={deleteError}
        />
      )}
    </div>
  );
};

export default MedicationCard;