import React from 'react';
import MedicationCard from './MedicationCard';

const MedicationList = ({ medications, onLogUpdated }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {medications.length === 0 ? (
        <p className="text-purple-200 text-lg col-span-full text-center">No medications added yet. Add one to get started!</p>
      ) : (
        medications.map((medication) => (
          <MedicationCard
            key={medication.id}
            medication={medication}
            logs={medication.logs || []} // Pass logs specific to this medication
            onLogUpdated={onLogUpdated}
          />
        ))
      )}
    </div>
  );
};

export default MedicationList;