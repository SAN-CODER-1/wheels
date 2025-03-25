import React, { useState } from 'react';
import axios from 'axios';
import './map.css'
import { useNavigate } from 'react-router-dom';
const UpdateLocation = () => {
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const navigate = useNavigate();
  // Fetch the user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setMessage('Location fetched successfully!');
        },
        (error) => {
          setMessage(`Error fetching location: ${error.message}`);
        }
      );
    } else {
      setMessage('Geolocation is not supported by this browser.');
    }
  };

  // Update the user's location on the backend
  const updateLocation = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to update your location.');
      return;
    }

    if (!location.latitude || !location.longitude) {
      setMessage('Please fetch your location first.');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:5000/api/location',
        { latitude: location.latitude, longitude: location.longitude },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate('/selectvehical');
      setMessage('Location updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update location');
    }
  };

  return (
    <div className="location-container">
      <h2>Get my location</h2>
      <div className="location-info">
        <p><strong>Latitude:</strong> {location.latitude} </p>
        <p><strong>Longitude:</strong> {location.longitude}</p><button className='bt1' onClick={getCurrentLocation}>Get Location</button>

      </div>
      {message && <p className="message">{message}</p>}
      
      <button className='btn' onClick={updateLocation}>Set Location</button>
    </div>
  );
};

export default UpdateLocation;