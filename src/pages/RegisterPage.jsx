import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForms';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams] = useSearchParams(); // Get URL search parameters
  const role = searchParams.get('role') || 'patient'; // Default to 'patient' if no role in URL

  const handleSubmit = async ({ username, password, role: submittedRole }) => { // Destructure submittedRole
    setErrorMessage('');
    const result = await register(username, password, submittedRole); // Pass the role to register
    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  return (
    <AuthForm
      type="register"
      onSubmit={handleSubmit}
      isLoading={loading}
      errorMessage={errorMessage}
      role={role} // Pass the role from URL to AuthForm
    />
  );
};

export default RegisterPage;