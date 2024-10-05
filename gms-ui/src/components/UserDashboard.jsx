// src/components/UserDashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import './Styles/Userdashboard.css'


const UserDashboard = () => {
  const { authDetails } = useContext(AuthContext); // Get auth details from context
  const { username, password } = authDetails; // Destructure username and password
  const [grievances, setGrievances] = useState([]);
  const [formData, setFormData] = useState({ description: '', type: '' });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/grievance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${username}:${password}`) // Add basic auth
        },
        body: JSON.stringify({ 
          ...formData, 
          username,
          status: 'submitted' // Set initial status to submitted
        }),
      });

      if (response.ok) {
        setMessage('Grievance created successfully!');
        setFormData({ description: '', type: '' });
        fetchGrievances(); // Refresh grievances after submission
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('An error occurred while creating the grievance.');
    }
  };

  const fetchGrievances = async () => {
    try {
      const response = await fetch(`http://localhost:8080/grievance/find?username=${username}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`) // Add basic auth
        }
      });
      if (response.ok) {
        const data = await response.json();
        setGrievances(data);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('No Grievnaces to display.');
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, [username]); // Depend on username to fetch grievances

  return (
    <div className="container mt-5">
      <h2 className="mb-4">User Dashboard</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        
        <div className="form-group">
        </div>
        <div className="form-group mt-3">
          <label>Type:</label>
          <input
            type="text"
            name="type"
            className="form-control"
            value={formData.type}
            onChange={handleInputChange}
            required
          />
          <label>Description:</label>
          <input
            type="text"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        
        </div>
        <button type="submit" className="btn btn-primary mt-3">Create Grievance</button>
      </form>
      {message && <div className="alert alert-info">{message}</div>}
      <h3>Your Grievances</h3>
      <ul className="list-group">
        {grievances.map((grievance) => (
          <li key={grievance.id} className="list-group-item">
            <strong>Description:</strong> {grievance.description} <br />
            <strong>Type:</strong> {grievance.type} <br />
            <strong>Status:</strong> {grievance.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
