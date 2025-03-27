import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './gardashbord.css'
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token is found
        return;
      }

      try {
        // Extract user ID from localStorage or decode it from the token
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?._id;

        if (!userId) {
          throw new Error('User ID not found');
        }

        // Include user ID in the headers
        const response = await axios.get('http://localhost:5000/api/booking', {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-User-ID': userId, // Add user ID to headers
          },
        });

        setUser(response.data.user); // Set user data
        console.log('Success: User data fetched');
      } catch (error) {
        setMessage(error.response?.data?.message || 'Failed to fetch user data');
        localStorage.removeItem('token'); // Clear invalid token
        localStorage.removeItem('user'); // Clear user data
        navigate('/login'); // Redirect to login
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    localStorage.removeItem('user'); // Clear user data
    navigate('/login'); // Redirect to login
  };

  if (!user) {
    return <p>Loading...</p>; // Show loading message while fetching data
  }

  return (
    <div className="dashboard-container">
      {message && <p className="error-message">{message}</p>}
      <div className="user-info">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Location:</strong> {user.latitude}, {user.longitude}</p>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;