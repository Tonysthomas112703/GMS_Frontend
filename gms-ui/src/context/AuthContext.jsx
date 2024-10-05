// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authDetails, setAuthDetails] = useState({
    username: '',
    password: '',
    role: ''
  });

  return (
    <AuthContext.Provider value={{ authDetails, setAuthDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
