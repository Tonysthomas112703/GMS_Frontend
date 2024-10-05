import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import './Styles/TechnicianRegistration.module.css';

const TechnicianRegistration = () => {
    const { authDetails } = useContext(AuthContext); // Access authDetails from context
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [expertise, setExpertise] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        const technicianData = {
            username,
            password,
            expertise,
        };

        // Encode username and password for basic authentication
        const auth = `${authDetails.username}:${authDetails.password}`;

        try {
            const response = await axios.post('http://localhost:8080/api/register-technician', technicianData, {
                headers: {
                    'Authorization': `Basic ${btoa(auth)}` // Use Basic Auth
                }
            });
            setMessage(response.data);
            // Optionally clear the form
            setUsername('');
            setPassword('');
            setExpertise('');
        } catch (error) {
            setMessage('Error registering technician: ' + (error.response ? error.response.data : error.message));
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Register Technician</h2>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Technician Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Expertise:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={expertise}
                                onChange={(e) => setExpertise(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Register Technician</button>
                    </form>
                    {message && <p className="mt-3 alert alert-info">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default TechnicianRegistration;
