import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns';
import { useMutation, useQueryClient } from 'react-query';
import { markMedicationAsTaken } from '../api';
import UploadProofForm from './UploadProofForm'; // You'll create this

const MedicationCalendar = ({ medications }) => {
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const startDay = startOfMonth(currentMonth);
  const endDay = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startDay, end: endDay });

  // Pad the beginning of the month to align with the first day of the week (Sunday)
  const firstDayOfWeek = startDay.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const paddedDays = Array(firstDayOfWeek).fill(null).concat(daysInMonth);

  const markTakenMutation = useMutation(markMedicationAsTaken, {
    onSuccess: () => {
      queryClient.invalidateQueries(['medications']);
    },
    onError: (error) => {
      console.error('Error marking medication:', error);
      alert(`Failed to update medication status: ${error.message || 'Unknown error'}`);
    },
  });

  const handleMarkTaken = (medId, date, takenStatus, logId) => {
    // If a log already exists for this date and medication, use its logId for update
    // Otherwise, logId will be null and the backend will create a new log
    markTakenMutation.mutate({ medicationId: medId, date: format(date, 'yyyy-MM-dd'), taken: takenStatus });
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    // You could potentially open a modal here to show all medications for that day
    // or to add a new log for any medication for that day.
  };

  const getLogForMedicationAndDay = (medication, day) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    return medication.logs?.find(log => log.date === formattedDay);
  };

  const handleUploadClick = (medication, date) => {
    const log = getLogForMedicationAndDay(medication, date);
    if (!log) {
      alert('Please mark the medication as taken for this day before uploading a photo.');
      return;
    }
    setSelectedMedication(medication);
    setSelectedDate(date);
    setShowUploadModal(true);
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    setSelectedMedication(null);
    setSelectedDate(null);
    queryClient.invalidateQueries(['medications']); // Refetch medications after upload
  };

  return (
    <div className="bg-purple-800 p-6 rounded-xl shadow-2xl border border-purple-700">
      <h3 className="text-3xl font-bold text-pink-300 mb-6 text-center">Medication Calendar</h3>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Previous Month
        </button>
        <span className="text-2xl font-semibold text-white">{format(currentMonth, 'MMMM yyyy')}</span>
        <button
          onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Next Month
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-purple-300 font-semibold mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {paddedDays.map((day, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg flex flex-col items-center justify-start min-h-[100px] text-sm relative
              ${day ? 'bg-purple-700 border border-purple-600' : 'bg-transparent'}
              ${day && isToday(day) ? 'border-2 border-pink-400 shadow-lg' : ''}
              ${day && isSameDay(day, selectedDate) ? 'ring-2 ring-teal-400' : ''}
              ${day ? 'cursor-pointer hover:bg-purple-600 transition-colors duration-200' : ''}
            `}
            onClick={() => day && handleDayClick(day)}
          >
            {day && (
              <span className={`font-bold text-lg mb-2 ${isToday(day) ? 'text-pink-300' : 'text-white'}`}>
                {format(day, 'd')}
              </span>
            )}
            {day && medications.map((med) => {
              const log = getLogForMedicationAndDay(med, day);
              const isTaken = log && log.taken === 1;
              const proofPhoto = log && log.proof_photo_path;

              return (
                <div key={med.id} className="w-full text-center text-xs mt-1">
                  <p className="text-purple-300 truncate">{med.name}</p>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent day click
                        handleMarkTaken(med.id, day, !isTaken);
                      }}
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${isTaken ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                        hover:opacity-80 transition-opacity duration-200`}
                      disabled={markTakenMutation.isLoading}
                    >
                      {isTaken ? '✔️ Taken' : '❌ Missed'}
                    </button>
                    {isTaken && ( // Only show upload button if marked as taken
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent day click
                          handleUploadClick(med, day);
                        }}
                        className="p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs"
                        title="Upload Proof"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                         </svg>
                      </button>
                    )}
                    {proofPhoto && (
                      <a
                        href={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}${proofPhoto}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs"
                        title="View Proof"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {showUploadModal && selectedMedication && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <UploadProofForm
            medicationId={selectedMedication.id}
            date={format(selectedDate, 'yyyy-MM-dd')}
            onUploadSuccess={handleUploadSuccess}
            onCancel={() => setShowUploadModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MedicationCalendar;