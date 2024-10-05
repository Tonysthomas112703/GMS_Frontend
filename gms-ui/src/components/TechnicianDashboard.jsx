import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Assuming you have an AuthContext
import { useNavigate } from 'react-router-dom';

const TechnicianDashboard = () => {
  const { authDetails } = useContext(AuthContext); // Access authDetails from context
  const [technicianId, setTechnicianId] = useState(''); // To store the technician ID input
  const [grievances, setGrievances] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(''); // Selected status for update
  const [technicianStatus, setTechnicianStatus] = useState(''); // For technician status update
  const [message, setMessage] = useState('');
  const [hasEnteredId, setHasEnteredId] = useState(false); // Track if the technician has entered ID

  const navigate = useNavigate();

  // Fetch grievances assigned to the logged-in technician by technician ID
  const fetchGrievances = async (technicianId) => {
    try {
      const response = await fetch(`http://localhost:8080/grievance/get-grievances?technicianId=${technicianId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${authDetails.username}:${authDetails.password}`)}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setGrievances(data);
      } else {
        setMessage('Error fetching grievances.');
      }
    } catch (error) {
      setMessage('An error occurred while fetching grievances.');
    }
  };

  // Handle status update for a grievance using grievanceId and status only
  const handleUpdateGrievanceStatus = async (grievanceId) => {
    if (!selectedStatus) {
      setMessage('Please select a status.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/grievance/update-grievance-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${authDetails.username}:${authDetails.password}`)}`,
        },
        body: JSON.stringify({
          grievanceId,
          status: selectedStatus,
        }),
      });

      if (response.ok) {
        setMessage('Grievance status updated successfully!');
        fetchGrievances(technicianId); // Refresh grievances after updating status
        setSelectedStatus(''); // Reset selected status after update
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('An error occurred while updating status.');
    }
  };

  // Handle technician status update
  const handleTechnicianStatusUpdate = async () => {
    if (!technicianStatus) {
      setMessage('Please select a technician status.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/technician/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${authDetails.username}:${authDetails.password}`)}`,
        },
        body: JSON.stringify({
          technicianId, // Include the technician ID in the body
          status: technicianStatus, // Include the status string
        }),
      });

      if (response.ok) {
        setMessage('Technician status updated successfully!');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('An error occurred while updating technician status.');
    }
  };

  // Handle submission of technician ID
  const handleTechnicianIdSubmit = (e) => {
    e.preventDefault();
    if (technicianId) {
      setHasEnteredId(true);
      fetchGrievances(technicianId); // Fetch grievances after the technician ID is entered
    } else {
      setMessage('Please enter your Technician ID.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Technician Dashboard</h2>
      {message && <p className="alert alert-info">{message}</p>}

      {!hasEnteredId ? (
        <form onSubmit={handleTechnicianIdSubmit}>
          <label htmlFor="technicianId">Enter Technician ID:</label>
          <input
            type="text"
            id="technicianId"
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary mt-2">
            Submit
          </button>
        </form>
      ) : (
        <>
          <h3>Your Grievances</h3>
          {grievances.length > 0 ? (
            <ul>
              {grievances.map((grievance) => (
                <li key={grievance.grievanceId}>
                  <div>
                    <strong>Grievance ID:</strong> {grievance.grievanceId}
                  </div>
                  <div>
                    <strong>Description:</strong> {grievance.description}
                  </div>
                  <div>
                    <strong>Type:</strong> {grievance.type}
                  </div>
                  <div>
                    <strong>Status:</strong> {grievance.status}
                  </div>
                  <div>
                    <strong>Username:</strong> {grievance.username}
                  </div>
                  {/* Add other grievance fields as needed */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value); // Update selected status
                    }}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  <button 
                    className="btn btn-primary ms-2" 
                    onClick={() => {
                      handleUpdateGrievanceStatus(grievance.grievanceId); // Update with grievance ID
                      setSelectedStatus(grievance.status); // Automatically select current status
                    }}
                  >
                    Update Status
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No grievances assigned yet.</p>
          )}

          <h3>Update Technician Status</h3>
          <select
            value={technicianStatus}
            onChange={(e) => setTechnicianStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
          <button className="btn btn-primary ms-2" onClick={handleTechnicianStatusUpdate}>
            Update Technician Status
          </button>
        </>
      )}
    </div>
  );
};

export default TechnicianDashboard;
