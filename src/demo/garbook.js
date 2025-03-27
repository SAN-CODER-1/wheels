import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './afterbook.css'
const GarageServiceApp = () => {
  // User data
  const userLocation = {
    lat: 12.9716,
    lng: 77.5946,
    address: "123 MG Road, Bangalore"
  };

  // Garage data
  const garageData = [
    {
      "garage_name": "Speedy Auto Repairs",
      "owner_name": "John Smith",
      "coordinates": { lat: 12.9786, lng: 77.5866 },
      "address": {
        "street": "123 Main Street",
        "city": "Springfield"
      },
      "rank": 1,
      "trusted_by_user": true,
      "services_offered": {
        "breakdown": true,
        "puncture_repair": true,
        "battery_issue": true,
        "oil_change": true
      },
      "estimated_cost": {
        "breakdown": 80.00,
        "puncture_repair": 25.00,
        "battery_issue": 50.00,
        "oil_change": 35.00
      },
      "image": "https://via.placeholder.com/100",
      "mechanic": {
        "name": "Rajesh Kumar",
        "phone": "+91 98765 43210",
        "vehicle": "Bike with tools"
      }
    },
    {
      "garage_name": "City Auto Care",
      "owner_name": "Sarah Johnson",
      "coordinates": { lat: 12.9616, lng: 77.5846 },
      "address": {
        "street": "456 Oak Avenue",
        "city": "Riverside"
      },
      "rank": 2,
      "trusted_by_user": false,
      "services_offered": {
        "breakdown": true,
        "puncture_repair": true,
        "tire_rotation": true,
        "brake_service": true,
        "ac_repair": true
      },
      "estimated_cost": {
        "breakdown": 75.00,
        "puncture_repair": 20.00,
        "tire_rotation": 25.00,
        "brake_service": 120.00,
        "ac_repair": 150.00
      },
      "image": "https://via.placeholder.com/100",
      "mechanic": {
        "name": "Amit Patel",
        "phone": "+91 98765 12345",
        "vehicle": "Mini van with equipment"
      }
    },
    {
      "garage_name": "Quick Fix Garage",
      "owner_name": "Mike Brown",
      "coordinates": { lat: 12.9916, lng: 77.6046 },
      "address": {
        "street": "789 Pine Road",
        "city": "Franklin"
      },
      "rank": 3,
      "trusted_by_user": true,
      "services_offered": {
        "breakdown": true,
        "puncture_repair": true,
        "battery_issue": false,
        "car_wash": true
      },
      "estimated_cost": {
        "breakdown": 90.00,
        "puncture_repair": 30.00,
        "car_wash": 15.00
      },
      "image": "https://via.placeholder.com/100",
      "mechanic": {
        "name": "Vijay Sharma",
        "phone": "+91 98765 67890",
        "vehicle": "Motorcycle with sidecar"
      }
    },
    {
      "garage_name": "Elite Auto Services",
      "owner_name": "David Wilson",
      "coordinates": { lat: 12.9654, lng: 77.5921 },
      "address": {
        "street": "321 Maple Drive",
        "city": "Greenfield"
      },
      "rank": 4,
      "trusted_by_user": true,
      "services_offered": {
        "breakdown": true,
        "engine_diagnostic": true,
        "electrical_repair": true,
        "premium_wash": true
      },
      "estimated_cost": {
        "breakdown": 100.00,
        "engine_diagnostic": 60.00,
        "electrical_repair": 85.00,
        "premium_wash": 25.00
      },
      "image": "https://via.placeholder.com/100",
      "mechanic": {
        "name": "Sanjay Gupta",
        "phone": "+91 98765 24680",
        "vehicle": "SUV with full toolkit"
      }
    },
    {
      "garage_name": "24/7 Mobile Mechanics",
      "owner_name": "Lisa Chen",
      "coordinates": { lat: 12.9832, lng: 77.5789 },
      "address": {
        "street": "654 Elm Street",
        "city": "Oakville"
      },
      "rank": 5,
      "trusted_by_user": true,
      "services_offered": {
        "breakdown": true,
        "puncture_repair": true,
        "battery_issue": true,
        "towing": true,
        "emergency_service": true
      },
      "estimated_cost": {
        "breakdown": 85.00,
        "puncture_repair": 22.00,
        "battery_issue": 55.00,
        "towing": 40.00,
        "emergency_service": 100.00
      },
      "image": "https://via.placeholder.com/100",
      "mechanic": {
        "name": "Rahul Mehta",
        "phone": "+91 98765 13579",
        "vehicle": "Pickup truck with towing"
      }
    },
    {
      "garage_name": "Budget Auto Fix",
      "owner_name": "Carlos Rodriguez",
      "coordinates": { lat: 12.9723, lng: 77.6012 },
      "address": {
        "street": "987 Cedar Lane",
        "city": "Pineville"
      },
      "rank": 6,
      "trusted_by_user": false,
      "services_offered": {
        "puncture_repair": true,
        "oil_change": true,
        "basic_wash": true,
        "light_bulb": true
      },
      "estimated_cost": {
        "puncture_repair": 18.00,
        "oil_change": 30.00,
        "basic_wash": 10.00,
        "light_bulb": 5.00
      },
      "image": "https://via.placeholder.com/100",
      "mechanic": {
        "name": "Arjun Reddy",
        "phone": "+91 98765 86420",
        "vehicle": "Compact car with basic tools"
      }
    }
  ];

  // App state
  const [state, setState] = useState({
    view: 'list', // list | details | payment | tracking | service
    selectedGarage: null,
    selectedService: null,
    filter: 'all',
    bookingDetails: null,
    paymentStatus: null,
    paymentDetails: {
      cardNumber: '',
      expiry: '',
      cvv: '',
      name: ''
    },
    tracking: {
      status: 'preparing', // preparing | enroute | arrived | service
      currentLocation: null,
      distance: 0,
      eta: 0,
      serviceTimer: 0
    }
  });

  // Calculate distance between two points
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

  // Generate route points
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

  // Handle service selection
  const handleSelectService = (garage, serviceType) => {
    setState(prev => ({
      ...prev,
      view: 'payment',
      selectedGarage: garage,
      selectedService: serviceType,
      bookingDetails: {
        garage,
        serviceType,
        amount: garage.estimated_cost[serviceType],
        date: new Date().toISOString().split('T')[0]
      }
    }));
  };

  // Process payment
  const handlePayment = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, paymentStatus: 'processing' }));
    
    // Simulate payment processing
    setTimeout(() => {
      const routePoints = generateRoute(
        state.selectedGarage.coordinates,
        userLocation
      );
      
      setState(prev => ({
        ...prev,
        view: 'tracking',
        paymentStatus: 'success',
        tracking: {
          ...prev.tracking,
          status: 'enroute',
          currentLocation: routePoints[0],
          distance: calculateDistance(
            routePoints[0].lat,
            routePoints[0].lng,
            userLocation.lat,
            userLocation.lng
          ).toFixed(1),
          eta: Math.round(calculateDistance(
            routePoints[0].lat,
            routePoints[0].lng,
            userLocation.lat,
            userLocation.lng
          ) * 10),
          route: routePoints
        }
      }));

      // Start tracking simulation
      simulateMechanicMovement(routePoints);
    }, 1500);
  };

  // Simulate mechanic movement
  const simulateMechanicMovement = (routePoints) => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      
      if (currentIndex >= routePoints.length - 1) {
        clearInterval(interval);
        setState(prev => ({
          ...prev,
          tracking: {
            ...prev.tracking,
            status: 'arrived',
            distance: 0,
            eta: 0
          }
        }));
        return;
      }
      
      const newLocation = routePoints[currentIndex];
      const newDistance = calculateDistance(
        newLocation.lat,
        newLocation.lng,
        userLocation.lat,
        userLocation.lng
      ).toFixed(1);
      
      setState(prev => ({
        ...prev,
        tracking: {
          ...prev.tracking,
          currentLocation: newLocation,
          distance: newDistance,
          eta: Math.max(0, Math.round(newDistance * 10))
        }
      }));
    }, 1500);
  };

  // Start service
  const startService = () => {
    setState(prev => ({
      ...prev,
      view: 'service',
      tracking: {
        ...prev.tracking,
        status: 'service'
      }
    }));
    
    // Service timer
    const timer = setInterval(() => {
      setState(prev => {
        if (prev.tracking.serviceTimer >= 60) {
          clearInterval(timer);
          return prev;
        }
        return {
          ...prev,
          tracking: {
            ...prev.tracking,
            serviceTimer: prev.tracking.serviceTimer + 1
          }
        };
      });
    }, 1000);
  };

  // Render current view
  const renderView = () => {
    switch (state.view) {
      case 'list':
        return (
          <div className="garage-list">
            <h1>Nearby Garages</h1>
            <div className="filters">
              <button onClick={() => setState(prev => ({ ...prev, filter: 'all' }))}>
                All Services
              </button>
              <button onClick={() => setState(prev => ({ ...prev, filter: 'breakdown' }))}>
                Breakdown
              </button>
            </div>
            
            {garageData
              .filter(garage => state.filter === 'all' || garage.services_offered[state.filter])
              .sort((a, b) => a.rank - b.rank)
              .map(garage => (
                <div key={garage.garage_name} className="garage-card">
                  <h3>{garage.garage_name}</h3><p>{garage.trusted_by_user?"trusted by user":""} </p>
                  <p>{garage.rank}</p>
                  <p>Distance: {calculateDistance(
                    garage.coordinates.lat,
                    garage.coordinates.lng,
                    userLocation.lat,
                    userLocation.lng
                  ).toFixed(1)} km</p>
                  
                  <button onClick={() => setState(prev => ({
                    ...prev,
                    view: 'details',
                    selectedGarage: garage
                  }))}>
                    View Services
                  </button>
                </div>
              ))}
          </div>
        );
      
      case 'details':
        return (
          <div className="service-details">
            <h2>{state.selectedGarage.garage_name}</h2>
            <p>Available Services:</p>
            
            {Object.entries(state.selectedGarage.services_offered)
              .filter(([_, available]) => available)
              .map(([service]) => (
                <div key={service} className="service-option">
                  <h4>{service.replace('_', ' ')}</h4>
                  <p>₹{state.selectedGarage.estimated_cost[service]}</p>
                  <button onClick={() => handleSelectService(state.selectedGarage, service)}>
                    Book Now
                  </button>
                </div>
              ))}
            
            <button onClick={() => setState(prev => ({ ...prev, view: 'list' }))}>
              Back to List
            </button>
          </div>
        );
      
      case 'payment':
        return (
          <div className="payment-view">
            <h2>Payment</h2>
            <p>Service: {state.selectedService.replace('_', ' ')}</p>
            <p>Amount: ₹{state.bookingDetails.amount}</p>
            
            <form onSubmit={handlePayment}>
              <input
                type="text"
                placeholder="Card Number"
                value={state.paymentDetails.cardNumber}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  paymentDetails: {
                    ...prev.paymentDetails,
                    cardNumber: e.target.value
                  }
                }))}
                required
              />
              
              <button type="submit" disabled={state.paymentStatus === 'processing'}>
                {state.paymentStatus === 'processing' ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          </div>
        );
      
      case 'tracking':
        return (
<div className="tracking-view">
            <h2>Mechanic is {state.tracking.status === 'enroute' ? 'on the way' : 'arrived'}</h2>
            <p>Mechanic: {state.selectedGarage.mechanic.name}</p>
            <p>Vehicle: {state.selectedGarage.mechanic.vehicle}</p>
            
            {state.tracking.status === 'enroute' && (
              <>
                <div className="progress-bar">
                  <div style={{ width: `${state.tracking.currentLocation.progress}%` }}></div>
                </div>
                <p>Distance: {state.tracking.distance} km</p>
                <p>ETA: {state.tracking.eta} minutes</p>
              </>
            )}
            
            {state.tracking.status === 'arrived' && (
              <>
                <QRCodeSVG 
                  value={`service-start:${state.bookingDetails.date}-${state.selectedGarage.garage_name}`} 
                  size={128}
                />
                <p>Scan QR to start service</p>
                <button onClick={startService}>
                  Simulate QR Scan (Demo)
                </button>
              </>
            )}
          </div>
        );
      
      case 'service':
        return (
          <div className="service-view">
            <h2>Service In Progress</h2>
            <p>Time elapsed: {state.tracking.serviceTimer} seconds</p>
            <div className="progress-bar">
              <div style={{ width: `${(state.tracking.serviceTimer / 60) * 100}%` }}></div>
            </div>
          </div>
        );
      
      default:
        return <div>Invalid view</div>;
    }
  };

  return (
    <div className="app-container">
      {state.view !== 'list' && (
        <button 
          className="back-button"
          onClick={() => setState(prev => {
            if (prev.view === 'details') return { ...prev, view: 'list' };
            if (prev.view === 'payment') return { ...prev, view: 'details' };
            return prev;
          })}
        >
          Back
        </button>
      )}
      
      {renderView()}
    </div>
  );
};

export default GarageServiceApp;