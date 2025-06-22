import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query'; // IMPORTANT: Using react-query (v3)
import { getCaretakerPatients } from '../api'; // You'll need to implement this in api.js
import LoadingSpinner from '../components/LoadingSpinner';
import MedicationCalendar from '../components/MedicationCalendar'; // Re-use MedicationCalendar

const CaretakerDashboard = () => {
  const { user, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'calendar'

  // Placeholder for fetching caretaker-specific data (e.g., list of patients they care for)
  // In a real application, this would fetch data about the patients this caretaker is linked to.
  // For demonstration, `getCaretakerPatients` in `api.js` returns dummy data.
  const { data: caretakerPatientsData, isLoading, isError, error } = useQuery(
    ['caretakerPatients', user?.id], // Query key includes user ID
    () => getCaretakerPatients(user.id), // Pass caretaker's ID
    {
      enabled: !!user && userRole === 'caretaker', // Only run query if user is logged in AND is a caretaker
      onError: (err) => {
        console.error('Failed to fetch caretaker patients:', err);
      },
    }
  );

  const patients = caretakerPatientsData?.patients || [];
  // For a real app, you'd select one patient to view their meds for the calendar
  // For now, if patients exist, we'll use the first one for the calendar demo.
  const patientForCalendar = patients[0] || { medications: [] };

  // Function to handle switching to patient mode (requires re-authentication)
  const handleSwitchToPatient = () => {
    logout(); // Log out the current caretaker session
    navigate('/login?role=patient'); // Redirect to login page for patient role
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="text-center text-red-300 p-8">
        <h2 className="text-3xl font-bold mb-4">Error loading data</h2>
        <p>There was an error fetching caretaker data: {error.message}</p>
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
    <div className="p-8 md:p-12 min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white font-inter">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-indigo-700">
        <h1 className="text-4xl font-extrabold text-green-300">
          Caretaker Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          {/* Show "Switch to Patient" if current user is a caretaker */}
          {userRole === 'caretaker' && (
            <button
              onClick={handleSwitchToPatient}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              Switch to Patient
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

      <p className="text-xl text-indigo-200 mb-8">
        Monitoring {patients[0]?.name || 'a patient'}'s medication adherence
      </p>

      {/* Tabs for Navigation */}
      <div className="flex justify-start border-b border-indigo-600 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-6 text-lg font-semibold rounded-t-lg transition-colors duration-200
            ${activeTab === 'overview' ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-800'}`
          }
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`py-3 px-6 text-lg font-semibold rounded-t-lg transition-colors duration-200
            ${activeTab === 'calendar' ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-800'}`
          }
        >
          Calendar View
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-8">
          {/* Overview Cards - Mimicking Screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-700 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105">
              <span className="text-5xl font-bold text-white mb-2">85%</span>
              <span className="text-green-200 text-sm">Adherence Rate</span>
            </div>
            <div className="bg-blue-700 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105">
              <span className="text-5xl font-bold text-white mb-2">5</span>
              <span className="text-blue-200 text-sm">Current Streak</span>
            </div>
            <div className="bg-orange-700 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105">
              <span className="text-5xl font-bold text-white mb-2">3</span>
              <span className="text-orange-200 text-sm">Missed This Month</span>
            </div>
            <div className="bg-teal-700 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105">
              <span className="text-5xl font-bold text-white mb-2">4</span>
              <span className="text-teal-200 text-sm">Taken This Week</span>
            </div>
          </div>

          {/* Today's Status Card */}
          <div className="bg-indigo-700 p-6 rounded-xl shadow-lg border border-indigo-600">
            <h3 className="text-2xl font-bold text-white mb-4">Today's Status</h3>
            <div className="bg-indigo-600 p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-indigo-200">Daily Medication Set</p>
                <p className="text-white text-lg font-semibold">8:00 AM</p>
              </div>
              <span className="bg-orange-500 text-white font-bold px-4 py-2 rounded-full">Pending</span>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-indigo-700 p-6 rounded-xl shadow-lg border border-indigo-600">
            <h3 className="text-2xl font-bold text-white mb-4">Quick Actions</h3>
            <ul className="space-y-3">
              <li>
                <button className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors duration-200">
                  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26c.39.26.85.4 1.3.4s.91-.14 1.3-.4L21 8m-17 0V6a2 2 0 012-2h14a2 2 0 012 2v2m-18 0V4a2 2 0 002-2h14a2 2 0 002 2v4m-18 0a2 2 0 01-2 2h16a2 2 0 012-2V6a2 2 0 01-2-2h16a2 2 0 012 2v2m-18 0v8a2 2 0 002 2h14a2 2 0 002-2v-8m-18 0H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v2m-18 0a2 2 0 01-2 2h16a2 2 0 012-2" />
                  </svg>
                  <span>Send Reminder Email</span>
                </button>
              </li>
              <li>
                <button className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors duration-200">
                  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.432 5.305 6.446 6.084 5.923 7.081A6.003 6.003 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m5 0v3a2 2 0 11-4 0v-3m4 0h4m-4 0h-4" />
                  </svg>
                  <span>Configure Notifications</span>
                </button>
              </li>
              <li>
                <button className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors duration-200" onClick={() => setActiveTab('calendar')}> {/* Link to calendar tab */}
                  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h.01M16 11h.01M6 15h.01M10 15h.01M14 15h.01M18 15h.01M6 19h.01M10 19h.01M14 19h.01M18 19h.01M4 6h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                  <span>View Full Calendar</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Monthly Adherence Progress */}
          <div className="bg-indigo-700 p-6 rounded-xl shadow-lg border border-indigo-600 mt-8">
            <h3 className="text-2xl font-bold text-white mb-4">Monthly Adherence Progress</h3>
            <p className="text-indigo-200 mb-2">Overall Progress</p>
            <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <span className="text-white text-sm">85%</span>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-pink-300 mb-6 text-center">Patient's Medication Calendar</h2>
          {/* IMPORTANT: For a real caretaker dashboard, you'd need to fetch the *selected patient's* medications.
              Our current API `getMedications` fetches the *authenticated user's* medications.
              So, this calendar will likely appear empty unless the caretaker account somehow also has medications linked,
              or if the backend is updated to allow fetching a specific patient's data.
          */}
          {patients.length > 0 ? (
            <MedicationCalendar medications={patientForCalendar.medications || []} />
          ) : (
            <p className="text-indigo-200 text-center text-lg">No patients selected or no medication data available for display.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CaretakerDashboard;