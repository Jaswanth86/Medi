import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useQueryClient } from 'react-query'; // IMPORTANT: Using react-query (v3)

const SocketContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user && token) {
      const newSocket = io(API_BASE_URL, {
        query: { token },
        extraHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        newSocket.emit('joinUserRoom', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
      });

      // Listen for real-time medication updates
      newSocket.on('medicationAdded', (data) => {
        console.log('Real-time: Medication Added', data);
        queryClient.invalidateQueries('medications'); // React Query v3 syntax
      });

      newSocket.on('medicationLogAdded', (data) => {
        console.log('Real-time: Medication Log Added', data);
        queryClient.invalidateQueries('medications'); // React Query v3 syntax
      });

      newSocket.on('medicationLogUpdated', (data) => {
        console.log('Real-time: Medication Log Updated', data);
        queryClient.invalidateQueries('medications'); // React Query v3 syntax
      });

      newSocket.on('medicationUpdated', (data) => {
        console.log('Real-time: Medication Updated', data);
        queryClient.invalidateQueries('medications'); // React Query v3 syntax
      });

      newSocket.on('medicationDeleted', (data) => {
        console.log('Real-time: Medication Deleted', data);
        queryClient.invalidateQueries('medications'); // React Query v3 syntax
      });

      newSocket.on('medicationProofUploaded', (data) => {
        console.log('Real-time: Medication Proof Uploaded', data);
        queryClient.invalidateQueries('medications'); // React Query v3 syntax
      });


      setSocket(newSocket);

      // Clean up on unmount or token change
      return () => {
        newSocket.disconnect();
      };
    } else if (!user && socket) {
      // If user logs out, disconnect socket
      socket.disconnect();
      setSocket(null);
    }
  }, [user, token, queryClient]); // Re-run effect if user or token changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    console.warn('useSocket must be used within a SocketProvider. Socket will be null.');
  }
  return context;
};