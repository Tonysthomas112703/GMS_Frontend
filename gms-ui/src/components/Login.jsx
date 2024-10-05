// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-white">Login</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
        <div className="form-group mb-3">
          <label className="text-muted">Username:</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={credentials.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="text-muted">Password:</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="text-muted">Role:</label>
          <select
            name="role"
            className="form-control"
            value={credentials.role}
            onChange={handleInputChange}
            required
          >
            <option value="USER">USER</option>
            <option value="ASSIGNEE">ASSIGNEE</option>
            <option value="TECHNICIAN">TECHNICIAN</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-block mb-3">Login</button>
        <button type="button" className="btn btn-secondary btn-block" onClick={handleRegister}>Register</button>
      </form>
      {message && <div className="alert alert-danger mt-3">{message}</div>}
    </div>
  );
};

export default Login;
