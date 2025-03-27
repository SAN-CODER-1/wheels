import React, { useState, useEffect } from 'react';

const OnTheWay = () => {
  // User's current location (dummy)
  const userLocation = {
    lat: 12.9716,
    lng: 77.5946,
    address: "123 MG Road, Bangalore"
  };

  // Garage data with coordinates
  const garageData = {
    name: "Speedy Auto Repairs",
    location: {
      lat: 12.9786,  // ~800m from user
      lng: 77.5866,
      address: "456 Brigade Road, Bangalore"
    },
    mechanic: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      vehicle: "Bike with tools"
    }
  };

  // State for tracking
  const [bookingStatus, setBookingStatus] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(garageData.location);
  const [distance, setDistance] = useState(0);
  const [eta, setEta] = useState(0);
  const [route, setRoute] = useState([]);

  // Calculate distance between two points (in km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Generate route points (simplified)
  const generateRoute = (start, end, steps = 20) => {
    const points = [];
    const latStep = (end.lat - start.lat) / steps;
    const lngStep = (end.lng - start.lng) / steps;
    
    for (let i = 0; i <= steps; i++) {
      points.push({
        lat: start.lat + (latStep * i),
        lng: start.lng + (lngStep * i),
        progress: (i / steps) * 100
      });
    }
    
    return points;
  };

  // Book service handler
  const handleBookService = () => {
    setBookingStatus('confirmed');
    const routePoints = generateRoute(garageData.location, userLocation);
    setRoute(routePoints);
    setCurrentLocation(routePoints[0]);
    setDistance(calculateDistance(
      routePoints[0].lat,
      routePoints[0].lng,
      userLocation.lat,
      userLocation.lng
    ).toFixed(1));
    setEta(Math.round(distance * 10)); // 6km/h average speed
  };

  // Simulate mechanic movement
  useEffect(() => {
    if (bookingStatus !== 'confirmed') return;
    
    if (route.length > 0 && currentLocation !== route[route.length - 1]) {
      const timer = setInterval(() => {
        const nextPoint = route.find(point => 
          point.progress > ((currentLocation.progress || 0) + 5
        ));
        
        if (nextPoint) {
          setCurrentLocation(nextPoint);
          const newDistance = calculateDistance(
            nextPoint.lat,
            nextPoint.lng,
            userLocation.lat,
            userLocation.lng
          ).toFixed(1);
          setDistance(newDistance);
          setEta(Math.max(0, Math.round(newDistance * 10)));
        } else {
          setBookingStatus('arrived');
          clearInterval(timer);
        }
      }, 1500); // Update every 1.5 seconds
      
      return () => clearInterval(timer);
    }
  }, [bookingStatus, currentLocation, route]);

  return (
    <div className="container">
      <header>
        <h1>Mobile Garage Service</h1>
        <p>Your location: {userLocation.address}</p>
      </header>

      {!bookingStatus ? (
        <div className="booking-card">
          <h2>{garageData.name}</h2>
          <p>Address: {garageData.location.address}</p>
          <p>Mechanic: {garageData.mechanic.name}</p>
          <p>Vehicle: {garageData.mechanic.vehicle}</p>
          
          <div className="distance-info">
            <p>Initial distance: {calculateDistance(
              garageData.location.lat,
              garageData.location.lng,
              userLocation.lat,
              userLocation.lng
            ).toFixed(1)} km</p>
          </div>
          
          <button onClick={handleBookService}>
            Book Mobile Service
          </button>
        </div>
      ) : bookingStatus === 'confirmed' ? (
        <div className="tracking-card">
          <h2>Mechanic is on the way!</h2>
          <p>Mechanic: {garageData.mechanic.name}</p>
          <p>Contact: {garageData.mechanic.phone}</p>
          
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${currentLocation.progress}%` }}></div>
            <div className="progress-labels">
              <span>Garage</span>
              <span>Your Location</span>
            </div>
          </div>
          
          <div className="location-info">
            <p>Current distance: {distance} km</p>
            <p>ETA: {eta} minutes</p>
            <p>Mechanic's current location: 
              {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
            </p>
          </div>
          
          <div className="map-container">
            {/* This would be a real map component in production */}
            <div className="simple-map">
              <div className="start-point">G</div>
              <div 
                className="mechanic-point" 
                style={{ left: `${currentLocation.progress}%` }}
              >
                M
              </div>
              <div className="end-point">U</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="arrival-card">
          <h2>Mechanic has arrived!</h2>
          <p>{garageData.mechanic.name} is at your location</p>
          <p>Please share your vehicle details</p>
          
          <div className="mechanic-info">
            <p>Phone: {garageData.mechanic.phone}</p>
            <p>Vehicle: {garageData.mechanic.vehicle}</p>
          </div>
          
          <button onClick={() => setBookingStatus(null)}>
            Start New Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default OnTheWay;