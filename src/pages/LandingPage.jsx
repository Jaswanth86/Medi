import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleContinue = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-800 to-indigo-900 text-white font-inter">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          {/* Heart Icon - Phosphor Icons or custom SVG */}
          <svg className="w-20 h-20 text-teal-400" fill="currentColor" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-pink-300 mb-4 animate-fade-in">
          Welcome to MediCare Companion
        </h1>
        <p className="text-xl text-purple-200">
          Your trusted partner in medication management. Choose your role to get
          started with personalized features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Patient Card */}
        <div className="bg-purple-700 p-8 rounded-xl shadow-2xl flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/30 border border-purple-600">
          <div className="mb-6">
            {/* Patient Icon - Lucide React or similar, or custom SVG */}
            <svg className="w-16 h-16 text-blue-400 mx-auto" fill="currentColor" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-blue-300 mb-4">I'm a Patient</h2>
          <p className="text-purple-200 mb-6 flex-grow">
            Track your medication schedule and maintain your health records
          </p>
          <ul className="text-left text-purple-200 text-sm mb-8 space-y-2">
            <li className="flex items-center"><span className="text-green-400 mr-2">●</span> Mark medications as taken</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">●</span> Upload proof photos (optional)</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">●</span> View your medication calendar</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">●</span> Large, easy-to-use interface</li>
          </ul>
          <button
            onClick={() => handleContinue('patient')}
            className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Continue as Patient
          </button>
        </div>

        {/* Caretaker Card */}
        <div className="bg-purple-700 p-8 rounded-xl shadow-2xl flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-green-500/30 border border-purple-600">
          <div className="mb-6">
            {/* Caretaker Icon - Lucide React or similar, or custom SVG */}
            <svg className="w-16 h-16 text-green-400 mx-auto" fill="currentColor" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-4 0c1.66 0 2.99-1.34 2.99-3S13.66 5 12 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6.5-.5H18v1H5.5c-.32 0-.64-.04-.96-.1-.33-.07-.63-.17-.91-.3-.27-.12-.5-.27-.69-.45-.19-.18-.34-.37-.44-.57-.1-.2-.14-.4-.14-.62 0-.22.04-.44.13-.65.09-.2.22-.39.38-.56.16-.17.34-.3.54-.4.2-.1.4-.17.6-.2.2-.03.4-.04.6-.04h1.5zm8.5-.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-4-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-300 mb-4">I'm a Caretaker</h2>
          <p className="text-purple-200 mb-6 flex-grow">
            Monitor and support your loved one's medication adherence
          </p>
          <ul className="text-left text-purple-200 text-sm mb-8 space-y-2">
            <li className="flex items-center"><span className="text-green-400 mr-2">●</span> Monitor medication compliance</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">●</span> Set up notification preferences</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">●</span> View detailed reports</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">●</span> Receive email alerts</li>
          </ul>
          <button
            onClick={() => handleContinue('caretaker')}
            className="w-full bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-200"
          >
            Continue as Caretaker
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;