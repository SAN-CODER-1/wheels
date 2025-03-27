import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './close-gar.css'

const ClosestGarage = () => {
  const [garages, setGarages] = useState([]);
  const [message, setMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const { garageId } = useParams();
  const [serviceType, setServiceType] = useState('');

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/bookservice',
        { garageId, serviceType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Booking successful!');
    } catch (error) {
      setMessage('Failed to book service. Please try again.');
      console.error('Error booking service:', error);
    }
  };
  // Function to get the user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setMessage('Location found! Fetching nearby garages...');
        },
        (error) => {
          setMessage('Unable to retrieve your location. Please enable location access.');
          console.error('Error getting location:', error);
        }
      );
    } else {
      setMessage('Geolocation is not supported by your browser.');
    }
  };

  // Fetch nearby garages using the user's location
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

  // Automatically fetch nearby garages when userLocation changes
  useEffect(() => {
    if (userLocation) {
      const { latitude, longitude } = userLocation;
      fetchNearbyGarages(latitude, longitude);
    }
  }, [userLocation]);

  // Get user location when the component mounts
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="closest-garage">
      <h2>Closest Garages</h2>
      {message && <p className="message">{message}</p>}
      <div className="garage-list">
        {garages.length > 0 ? (
          garages.map((garage) => (
            <div key={garage._id} className="garage-item">
              <h3>{garage.garageName}</h3>
              <p><strong>Owner:</strong> {garage.ownerName}</p>
              <p><strong>Rank:</strong> {garage.rank}</p>
              <p><strong>Distance:</strong> {garage.distance.toFixed(2)} km</p>
              <p><strong>Service Type:</strong> {garage.serviceType}</p>
              <button onClick={handleBooking}>Book Now</button>
              {message && <p>{message}</p>}
            </div>
          ))
        ) : (
          <p>No garages found nearby.</p>
        )}
      </div>
      <div>
      <h2>Book a Service</h2>
      <input
        type="text"
        placeholder="Service Type"
        value={serviceType}
        onChange={(e) => setServiceType(e.target.value)}
      />
      <button onClick={handleBooking}>Book Now</button>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
};


export default ClosestGarage;