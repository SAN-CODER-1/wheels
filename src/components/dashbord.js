import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './dashbord.css';

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
        const response = await axios.get('http://localhost:5000/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user); // Set user data
        console.log("success")
      } catch (error) {
        setMessage(error.response?.data?.message || 'Failed to fetch user data');
        localStorage.removeItem('token'); // Clear invalid token
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
    <>
    <div className="dashboard-container">
      {message && <p className="error-message">{message}</p>}
        <p className='greet'>Hello,<strong>{user.username}</strong> pick our tools to solve your problem</p>
    </div>
      <div className="user-info">
      <p><strong>Name:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Location:</strong> {user.latitude}, {user.longitude}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

export default Dashboard;