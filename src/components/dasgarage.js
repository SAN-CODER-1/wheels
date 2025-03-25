import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GarageOwnerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch bookings for the garage owner
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view bookings.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/garagesbooking', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(response.data.bookings);
        setError('');
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch bookings. Please try again.');
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="garage-owner-dashboard">
      <h2>Your Garage Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Garage Name</th>
              <th>Vehicle Type</th>
              <th>Service Type</th>
              <th>Customer Name</th>
              <th>Location</th>
              <th>Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.garageId.garageName}</td>
                <td>{booking.vehicleType}</td>
                <td>{booking.serviceType}</td>
                <td>{booking.userName}</td>
                <td>
                  Lat: {booking.userLocation.coordinates[1]}, Long: {booking.userLocation.coordinates[0]}
                </td>
                <td>{new Date(booking.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GarageOwnerDashboard;