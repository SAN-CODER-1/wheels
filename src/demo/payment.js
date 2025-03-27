import React, { useState } from 'react';

const Payment = () => {
  // Dummy location and garage data (same as before)
  const dummyLocation = {
    name: "My Location",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    address: "123 Dummy Street, Bangalore"
  };

  const garageData = [
    // ... (same garage data with coordinates as before)
  ];

  // Payment gateway mock functions
  const processPayment = async (paymentDetails) => {
    // In a real app, this would connect to Stripe/Razorpay/etc.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
          amount: paymentDetails.amount
        });
      }, 1500); // Simulate API delay
    });
  };

  // State management
  const [selectedService, setSelectedService] = useState(null);
  const [filter, setFilter] = useState('all');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Calculate distance/time (same as before)
  // ...

  // Booking handler
  const handleBookService = (serviceType) => {
    setBookingDetails({
      garage: selectedService,
      serviceType,
      amount: selectedService.estimated_cost[serviceType],
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Payment handler
  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentStatus('processing');
    
    try {
      const result = await processPayment({
        amount: bookingDetails.amount,
        currency: 'INR',
        ...paymentDetails
      });
      
      if (result.success) {
        setPaymentStatus('success');
        // In a real app, you would save the booking to your database here
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      setPaymentStatus('failed');
    }
  };

  // Render payment form
  const renderPaymentForm = () => (
    <div className="payment-modal">
      <h3>Payment Details</h3>
      <p>Service: {bookingDetails.serviceType.replace('_', ' ')}</p>
      <p>Amount: ₹{bookingDetails.amount}</p>
      
      <form onSubmit={handlePayment}>
        <div className="form-group">
          <label>Card Number</label>
          <input 
            type="text" 
            value={paymentDetails.cardNumber}
            onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Expiry Date</label>
          <input 
            type="text" 
            value={paymentDetails.expiry}
            onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
            placeholder="MM/YY"
            required
          />
        </div>
        
        <div className="form-group">
          <label>CVV</label>
          <input 
            type="text" 
            value={paymentDetails.cvv}
            onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
            placeholder="123"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Cardholder Name</label>
          <input 
            type="text" 
            value={paymentDetails.name}
            onChange={(e) => setPaymentDetails({...paymentDetails, name: e.target.value})}
            placeholder="John Doe"
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={paymentStatus === 'processing'}
        >
          {paymentStatus === 'processing' ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
      
      {paymentStatus === 'success' && (
        <div className="payment-success">
          <h4>Payment Successful!</h4>
          <p>Transaction ID: {paymentDetails.transactionId}</p>
          <button onClick={() => {
            setBookingDetails(null);
            setSelectedService(null);
            setPaymentStatus(null);
          }}>
            Done
          </button>
        </div>
      )}
      
      {paymentStatus === 'failed' && (
        <div className="payment-failed">
          <h4>Payment Failed</h4>
          <p>Please try again or use another payment method</p>
          <button onClick={() => setPaymentStatus(null)}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container">

      {/* Header and filters (same as before) */}
      
      {/* Garage listing (same as before) */}
      
      {/* Service selection modal */}
      {selectedService && !bookingDetails && (
        <div className="service-modal">
          <h2>{selectedService.garage_name}</h2>
          <p>Select a service:</p>
          
          <div className="service-options">
            {Object.entries(selectedService.services_offered)
              .filter(([_, available]) => available)
              .map(([service]) => (
                <div key={service} className="service-option">
                  <h4>{service.replace('_', ' ')}</h4>
                  <p>₹{selectedService.estimated_cost[service]}</p>
                  <button onClick={() => handleBookService(service)}>
                    Book Now
                  </button>
                </div>
              ))}
          </div>
          
          <button onClick={() => setSelectedService(null)}>
            Back to List
          </button>
        </div>
      )}
      
      {/* Payment modal */}
      {bookingDetails && renderPaymentForm()}
    </div>
  );
};

export default Payment;