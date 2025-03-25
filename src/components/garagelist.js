import React from 'react';

const GarageList = ({ garages, onSelectGarage }) => {
  return (
    <div className="garage-list">
      {garages.map((garage) => (
        <div key={garage._id} className="garage-item">
          <h3>{garage.garageName}</h3>
          <p>Owner: {garage.ownerName}</p>
          <p>Distance: {garage.distance.toFixed(2)} km</p>
          <p>Service Type: {garage.serviceType}</p>
          <button onClick={() => onSelectGarage(garage._id)}>Book Service</button>
        </div>
      ))}
    </div>
  );
};

export default GarageList;