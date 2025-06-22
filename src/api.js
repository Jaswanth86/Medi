import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle expired tokens or unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('API Error: Unauthorized. Redirecting to login.');
      // The AuthContext will handle the logout and navigation
    }
    return Promise.reject(error);
  }
);


// --- Authentication Endpoints ---
export const loginUser = async ({ username, password }) => {
  const response = await api.post('/api/auth/login', { username, password });
  return response.data;
};

export const registerUser = async ({ username, password }) => {
  const response = await api.post('/api/auth/register', { username, password });
  return response.data;
};

// --- Medication Endpoints ---
export const addMedication = async (medicationData) => {
  const response = await api.post('/api/medications', medicationData);
  return response.data;
};

export const getMedications = async () => {
  const response = await api.get('/api/medications');
  return response.data;
};

export const markMedicationAsTaken = async ({ medicationId, date, taken }) => {
  const response = await api.put(`/api/medications/${medicationId}/taken`, { date, taken });
  return response.data;
};

export const updateMedication = async ({ medicationId, name, dosage, frequency }) => {
  const response = await api.put(`/api/medications/${medicationId}`, { name, dosage, frequency });
  return response.data;
};

export const deleteMedication = async (medicationId) => {
  const response = await api.delete(`/api/medications/${medicationId}`);
  return response.data;
};

export const uploadProofPhoto = async ({ medicationId, logId, formData }) => {
  const response = await api.post(`/api/medications/${medicationId}/log/${logId}/upload-proof`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Placeholder for future Caretaker API calls
export const getCaretakerPatients = async (caretakerId) => {
  // In a real application, this would fetch a list of patients associated with the caretaker
  console.warn("getCaretakerPatients: This is a placeholder API call. Implement backend logic for caretaker-patient relationships.");
  return {
    patients: [
      { id: 1, name: "Eleanor Thompson", medicationsCount: 3, adherence: "85%" },
      { id: 2, name: "John Doe", medicationsCount: 2, adherence: "70%" },
    ]
  };
};