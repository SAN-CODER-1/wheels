import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const [vehicleType, setVehicleType] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [garageId, setgarageId] = useState();
  const [message, setMessage] = useState('');
  const [garages, setGarages] = useState([]);
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);

  // Get the user's location using the Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setMessage('Unable to retrieve your location. Please enable location access.');
        }
      );
    } else {
      setMessage('Geolocation is not supported by your browser.');
    }
  }, []);

  // Fetch nearby garages when userLocation is available
  useEffect(() => {
    if (userLocation) {
      fetchNearbyGarages(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  const fetchNearbyGarages = async (latitude, longitude) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to view nearby garages.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/nearby', {
        headers: { Authorization: `Bearer ${token}` },
        params: { latitude, longitude, maxDistance: 10 }, // Include maxDistance
      });

      console.log('Backend response:', response.data); // Log the response
      setGarages(response.data.garages);
      setMessage('Nearby garages found!');
    } catch (error) {
      if (error.response) {
        console.error('Backend error response:', error.response.data);
        setMessage(error.response.data.message || 'Failed to fetch nearby garages');
      } else {
        setMessage('Failed to fetch nearby garages. Please try again.');
      }
    }
  };

  const handleBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to submit this form.');
      return;
    }
  
    if (!vehicleType || !serviceType || !userLocation || !garageId) {
      setMessage('Please fill out all fields and allow location access.');
      return;
    }
  
    try {
      // Fetch the user's name from the backend or local storage
      let userName = 'Unknown User';
      try {
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          userName = user.name;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
  
      // Send the booking request
      const response = await axios.post(
        'http://localhost:5000/api/bookservice',
        {
          garageId,
          vehicleType,
          serviceType,
          userLocation,
          userName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Check if the response is valid JSON
      if (response.data) {
        navigate('/garage');
        setMessage('Booking successful!');
      } else {
        setMessage('Invalid response from the server.');
      }
    } catch (error) {
      // Handle errors properly
      if (error.response) {
        setMessage(error.response.data.message || 'Failed to submit booking');
      } else if (error.request) {
        setMessage('No response from the server. Please try again.');
      } else {
        setMessage('An error occurred. Please try again.');
      }
      console.error('Error submitting booking:', error);
    }
  };

  return (
    <div className="booking-form">
      <h2>Book a Service</h2>
      {message && <p className="message">{message}</p>}
      <div className="form-group">
        <label>Vehicle Type:</label>
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          required
        >
          <option value="">Select Vehicle Type</option>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="truck">Truck</option>
          <option value="scooter">Scooter</option>
        </select>
      </div>
      <div className="form-group">
        <label>Service Type:</label>
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          required
        >
          <option value="">Select Service Type</option>
          <option value="repair">Repair</option>
          <option value="maintenance">Maintenance</option>
          <option value="inspection">Inspection</option>
          <option value="cleaning">Cleaning</option>
        </select>
      </div>
      <div className="form-group">
        <label>Select Garage:</label>
        <select
          value={garageId}
          onChange={(e) => setgarageId(e.target.value)}
          required
        >
          <option value="">Select a Garage</option>
          {garages.map((garage) => (
            <option key={garage._id} value={garage._id}>
              {garage.garageName} ({garage.distance.toFixed(2)} km)
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Your Location:</label>
        {userLocation ? (
          <p>
            Latitude: {userLocation.latitude}, Longitude: {userLocation.longitude}
          </p>
        ) : (
          <p>Fetching location...</p>
        )}
      </div>
      <button onClick={handleBooking}>Book Now</button>
    </div>
  );
};

export default BookingForm;