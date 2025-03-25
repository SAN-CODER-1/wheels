import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GarageList from '../components/garagelist';
import BookingForm from '../components/bookservice';

const Garages = () => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGarageId, setSelectedGarageId] = useState(null);

  // Fetch nearby garages
  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/nearby', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGarages(response.data.garages);
      } catch (error) {
        console.error('Error fetching garages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGarages();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="garages-page">
      <h1>Nearby Garages</h1>
      <GarageList garages={garages} onSelectGarage={setSelectedGarageId} />
      {selectedGarageId && <BookingForm garageId={selectedGarageId} />}
    </div>
  );
};

export default Garages;