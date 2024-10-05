import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Styles/AssigneeDashboard.module.css'; // Import your custom CSS module

const AssigneeDashboard = () => {
  const { authDetails } = useContext(AuthContext);
  const [unassignedGrievances, setUnassignedGrievances] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [selectedTechnicianName, setSelectedTechnicianName] = useState('');
  const [selectedGrievanceId, setSelectedGrievanceId] = useState('');
  const [message, setMessage] = useState('');
  const [showTechnicians, setShowTechnicians] = useState(false);
  const navigate = useNavigate();

  // Fetch Unassigned Grievances
  const fetchUnassignedGrievances = async () => {
    try {
      const response = await fetch('http://localhost:8080/grievance/unassigned', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${authDetails.username}:${authDetails.password}`)}`,
        },
      });
      const data = await response.json();
      setUnassignedGrievances(data);

      // Check if grievances are empty only after the data is fetched
      if (data.length === 0) {
        setMessage('No unassigned grievances left.');
      }
    } catch (error) {
      setMessage('Error fetching unassigned grievances.');
    }
  };

  // Fetch Technicians
  const fetchTechnicians = async () => {
    try {
      const response = await fetch('http://localhost:8080/grievance/technicians', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${authDetails.username}:${authDetails.password}`)}`,
        },
      });
      const data = await response.json();
      setTechnicians(data);
    } catch (error) {
      setMessage('Error fetching technicians.');
    }
  };

  // Handle Assign Technician
  const handleAssignTechnician = async () => {
    if (!selectedGrievanceId || !selectedTechnician) {
      setMessage('Please select both grievance and technician.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/grievance/assign?grievanceId=${selectedGrievanceId}&technicianId=${selectedTechnician}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Basic ${btoa(`${authDetails.username}:${authDetails.password}`)}`,
        },
      });

      if (response.ok) {
        setMessage(`Technician ${selectedTechnicianName} assigned successfully!`);
        setSelectedGrievanceId('');
        setSelectedTechnician('');
        setSelectedTechnicianName('');

        // Fetch grievances again after successful assignment
        fetchUnassignedGrievances();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('An error occurred while assigning the technician.');
    }
  };

  // Fetch data on component load
  useEffect(() => {
    fetchUnassignedGrievances();
    fetchTechnicians();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Assignee Dashboard</h2>
      {message && <p className={styles.alert}>{message}</p>}

      <h3>Unassigned Grievances</h3>
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Grievance ID</th>
              <th>Username</th>
              <th>Description</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {unassignedGrievances.length > 0 ? (
              unassignedGrievances.map((grievance) => (
                <tr key={grievance.grievanceId}>
                  <td>{grievance.grievanceId}</td>
                  <td>{grievance.username}</td>
                  <td>{grievance.description}</td>
                  <td>{grievance.type}</td>
                  <td>{grievance.status}</td>
                  <td>
                    <button
                      className={styles.selectButton}
                      onClick={() => {
                        setSelectedGrievanceId(grievance.grievanceId);
                        setSelectedTechnician('');
                      }}
                    >
                      Select for Assignment
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No unassigned grievances available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Technician Selection */}
      {selectedGrievanceId && (
        <div className={styles.technicianSelection}>
          <h4>Assign Technician for Grievance ID: {selectedGrievanceId}</h4>
          <select
            value={selectedTechnician}
            onChange={(e) => {
              const selectedTechId = e.target.value;
              const selectedTech = technicians.find((tech) => tech.id === selectedTechId);
              setSelectedTechnician(selectedTechId);
              setSelectedTechnicianName(selectedTech ? selectedTech.username : '');
            }}
            className={styles.select}
            required
          >
            <option value="">Select Technician</option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.username}
              </option>
            ))}
          </select>
          <button className={styles.confirmButton} onClick={handleAssignTechnician}>
            Confirm Assignment
          </button>
        </div>
      )}

      {/* Button to toggle technician view */}
      <button
        className={styles.toggleButton}
        onClick={() => setShowTechnicians(!showTechnicians)}
      >
        {showTechnicians ? 'Hide Technicians' : 'Show Technicians'}
      </button>

      {/* Conditional rendering of technician list */}
      {showTechnicians && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h4>All Technicians</h4>
          </div>
          <div className={styles.cardBody}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Expertise</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {technicians.map((tech) => (
                  <tr key={tech.id}>
                    <td>{tech.id}</td>
                    <td>{tech.username}</td>
                    <td>{tech.expertise}</td>
                    <td>{tech.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Button for Technician Registration */}
      <button
        className={styles.registerButton}
        onClick={() => navigate('/register-technician')}
      >
        Register Technician
      </button>
    </div>
  );
};

export default AssigneeDashboard;
