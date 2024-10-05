// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Styles/Login.module.css'; // Importing CSS module

const Login = () => {
  const { setAuthDetails } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: '', password: '', role: 'USER' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Check if the role from the response matches the provided role
        if (data.role !== credentials.role) {
          setMessage('Role mismatch. Please check your role.');
          return;
        }

        setAuthDetails({ username: data.username, password: credentials.password, role: data.role });
        
        // Redirect based on role
        if (data.role === 'USER') {
          navigate('/user-dashboard');
        } else if (data.role === 'ASSIGNEE') {
          navigate('/assignee-dashboard');
        } else if (data.role === 'TECHNICIAN') {
          navigate('/technician-dashboard');
        }
      } else {
        setMessage('Invalid credentials, please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while logging in.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Username:</label>
          <input
            type="text"
            name="username"
            className={styles.input}
            value={credentials.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            className={styles.input}
            value={credentials.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Role:</label>
          <select
            name="role"
            className={styles.select}
            value={credentials.role}
            onChange={handleInputChange}
            required
          >
            <option value="USER">USER</option>
            <option value="ASSIGNEE">ASSIGNEE</option>
            <option value="TECHNICIAN">TECHNICIAN</option>
          </select>
        </div>
        <button type="submit" className={styles.submitButton}>Login</button>
        <button type="button" className={styles.registerButton} onClick={handleRegister}>Register</button>
      </form>
      {message && <div className={styles.alert}>{message}</div>}
    </div>
  );
};

export default Login;
