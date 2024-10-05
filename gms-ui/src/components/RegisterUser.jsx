// src/components/RegisterUser.jsx
import React, { useState } from "react";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "USER", // Set a default role
  });
  const [message, setMessage] = useState("");

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/register", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("User registered successfully!");
        setFormData({ username: "", password: "", role: "USER" }); 
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("An error occurred while registering the user.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Register User</h2>
      <form onSubmit={handleSubmit} className="border p-4 shadow rounded">
        <div className="form-group">
          <label>Username: </label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password: </label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Role: </label>
          <select
            name="role"
            className="form-control"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="USER">User</option>
    
          </select>
        </div>

        <button type="submit" className="btn btn-primary btn-block">Register</button>
      </form>

      {message && <p className="text-center mt-3">{message}</p>}
    </div>
  );
};

export default RegisterUser;
