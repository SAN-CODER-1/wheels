import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './reg-gar.css';

const RegisterGarage = () => {
  const [garageName, setGarageName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [rank, setRank] = useState(0);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to register a garage.');

      return;
    }

    // Validate latitude and longitude as numbers
    if (isNaN(latitude) || isNaN(longitude)) {
      setMessage('Latitude and longitude must be valid numbers.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/putgarages',
        {
          garageName,
          ownerName,
          email,
          rank: Number(rank), // Ensure rank is a number
          latitude: Number(latitude), // Convert to number
          longitude: Number(longitude), // Convert to number
          serviceType,
          password,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Explicit content type
          },
        }
      );

      setMessage('Garage registered successfully!');
      navigate('/dashboard');
    } catch (error) {
      // Handle specific error messages from the backend
      const errorMessage = error.response?.data?.message || 'Registration failed.';
      setMessage(errorMessage);

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  return (
    <div className="register-garage">
      <h2>Register Your Garage</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Garage Name"
          value={garageName}
          onChange={(e) => setGarageName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Owner Name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Rank (0-5)"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          min="0"
          max="5"
          required
        />
        <input
          type="number"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          step="any" // Allow decimal values
          required
        />
        <input
          type="number"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          step="any" // Allow decimal values
          required
        />
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          required
        >
          <option value="">Select Service Type</option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="big">Big Vehicles</option>
        </select>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterGarage;