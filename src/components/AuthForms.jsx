import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AuthForm = ({ type, onSubmit, isLoading, errorMessage, role }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');

    if (!username.trim()) {
      setUsernameError('Username is required.');
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ username, password, role }); // Pass role to onSubmit
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-purple-700 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 transform transition-all duration-300 hover:scale-105"
      >
        <h2 className="text-4xl font-bold text-white text-center mb-8">
          {type === 'login' ? `Login as ${role === 'patient' ? 'Patient' : 'Caretaker'}` : `Register as ${role === 'patient' ? 'Patient' : 'Caretaker'}`}
        </h2>

        {errorMessage && (
          <p className="text-red-300 text-center text-sm bg-red-800 p-3 rounded-md animate-pulse">
            {errorMessage}
          </p>
        )}

        <div>
          <label className="block text-purple-200 text-sm font-semibold mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError(''); // Clear error on change
            }}
            className={`w-full p-3 rounded-lg bg-purple-600 text-white border-2 ${
              usernameError ? 'border-red-500' : 'border-purple-600'
            } focus:border-pink-500 outline-none transition-colors duration-200`}
            placeholder="Enter your username"
            disabled={isLoading}
          />
          {usernameError && <p className="text-red-300 text-xs mt-1">{usernameError}</p>}
        </div>

        <div>
          <label className="block text-purple-200 text-sm font-semibold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(''); // Clear error on change
            }}
            className={`w-full p-3 rounded-lg bg-purple-600 text-white border-2 ${
              passwordError ? 'border-red-500' : 'border-purple-600'
            } focus:border-pink-500 outline-none transition-colors duration-200`}
            placeholder="••••••••"
            disabled={isLoading}
          />
          {passwordError && <p className="text-red-300 text-xs mt-1">{passwordError}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-pink-700 transition-all duration-300 transform hover:scale-100 flex items-center justify-center space-x-2"
          disabled={isLoading}
        >
          {isLoading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
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
          <span>{type === 'login' ? 'Login' : 'Sign Up'}</span>
        </button>

        {/* Dynamic Link for switching between login/register pages while preserving role */}
        {type === 'login' ? (
          <p className="text-center text-purple-200 text-sm">
            Don't have an account?{' '}
            <Link to={`/register?role=${role}`} className="text-pink-400 hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        ) : (
          <p className="text-center text-purple-200 text-sm">
            Already have an account?{' '}
            <Link to={`/login?role=${role}`} className="text-pink-400 hover:underline font-semibold">
              Login
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default AuthForm;