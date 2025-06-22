import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from 'react-query'; // IMPORTANT: Using react-query (v3)
import { getMedications } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import MedicationList from '../components/MedicationList';
import AddMedicationForm from '../components/AddMedicationForm';
import MedicationCalendar from '../components/MedicationCalendar';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const { user, logout, userRole } = useAuth();
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const navigate = useNavigate();

  // Fetch medications using React Query v3 syntax
  const { data, isLoading, isError, error } = useQuery(
    ['medications', user?.id], // Query key includes user ID to refetch if user changes
    getMedications,
    {
      enabled: !!user && userRole === 'patient', // Only run query if user is logged in AND is a patient
      onError: (err) => {
        console.error('Failed to fetch medications:', err);
      },
    }
  );

  // Access the actual medications array from the data object
  const medications = data?.medications || []; // Access data.medications

  // Function to handle switching to caretaker mode (requires re-authentication)
  const handleSwitchToCaretaker = () => {
    logout(); // Log out the current patient session
    navigate('/login?role=caretaker'); // Redirect to login page for caretaker role
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="text-center text-red-300 p-8">
        <h2 className="text-3xl font-bold mb-4">Error loading data</h2>
        <p>There was an error fetching your medications: {error.message}</p>
        <button
          onClick={logout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-purple-700">
        <h1 className="text-4xl font-extrabold text-pink-300">
          Welcome, {user?.username}!
        </h1>
        <div className="flex items-center space-x-4">
          {/* Show "Switch to Caretaker" if current user is a patient */}
          {userRole === 'patient' && (
            <button
              onClick={handleSwitchToCaretaker}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              Switch to Caretaker
            </button>
          )}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mb-8 flex justify-center space-x-4">
        <button
          onClick={() => setView('list')}
          className={`py-3 px-6 rounded-full font-semibold transition-all duration-300 transform ${
            view === 'list'
              ? 'bg-pink-600 shadow-xl scale-105 text-white'
              : 'bg-purple-700 text-purple-200 hover:bg-purple-600'
          }`}
        >
          Medication List
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`py-3 px-6 rounded-full font-semibold transition-all duration-300 transform ${
            view === 'calendar'
              ? 'bg-pink-600 shadow-xl scale-105 text-white'
              : 'bg-purple-700 text-purple-200 hover:bg-purple-600'
          }`}
        >
          Calendar View
        </button>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <AddMedicationForm />

        {view === 'list' ? (
          <MedicationList medications={medications} />
        ) : (
          <MedicationCalendar medications={medications} />
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;