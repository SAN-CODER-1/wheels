import React, { useState } from "react";


const VehicleServiceSelector = () => {

  // Arrays for car and bike models
  const carModels = [
    "Toyota Camry",
    "Honda Civic",
    "Ford Mustang",
    "Chevrolet Corvette",
    "BMW 3 Series",
  ];

  const bikeModels = [
    "Harley-Davidson Sportster",
    "Yamaha YZF-R1",
    "Kawasaki Ninja 400",
    "Ducati Panigale V4",
    "Royal Enfield Classic 350",
  ];

  // Array for service types
  const serviceTypes = {
    car: ["Oil Change", "Tire Replacement", "Brake Service", "Engine Tune-Up", "Car Wash"],
    bike: ["Puncture Repair", "Chain Lubrication", "Brake Service", "Engine Tune-Up", "Bike Wash"],
  };

  // State for selected vehicle type, model, and service type
  const [vehicleType, setVehicleType] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Handle vehicle type change
  const handleVehicleChange = (event) => {
    setVehicleType(event.target.value);
    setSelectedModel(""); // Reset selected model when vehicle type changes
    setSelectedService(""); // Reset selected service when vehicle type changes
  };

  // Handle model selection change
  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  // Handle service type selection change
  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleType || !selectedModel || !selectedService) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/vehicleservices', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleType,
          model: selectedModel,
          serviceType: selectedService,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save vehicle service selection");
      }

      const data = await response.json();
      alert("Vehicle service selection saved successfully!");
      navigate('/selectvehical');
      setSubmitted(true);
    } catch (error) {
      alert("Error saving vehicle service selection: " + error.message);
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Vehicle Service Selector</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              value="car"
              checked={vehicleType === "car"}
              onChange={handleVehicleChange}
            />
            Car
          </label>
          <label>
            <input
              type="radio"
              value="bike"
              checked={vehicleType === "bike"}
              onChange={handleVehicleChange}
            />
            Bike
          </label>
        </div>

        {vehicleType === "car" && (
          <div>
            <h2>Select Car Model</h2>
            <select value={selectedModel} onChange={handleModelChange} required>
              <option value="">-- Select a Car Model --</option>
              {carModels.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        )}

        {vehicleType === "bike" && (
          <div>
            <h2>Select Bike Model</h2>
            <select value={selectedModel} onChange={handleModelChange} required>
              <option value="">-- Select a Bike Model --</option>
              {bikeModels.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedModel && (
          <div>
            <h2>Select Service Type</h2>
            <select value={selectedService} onChange={handleServiceChange} required>
              <option value="">-- Select a Service Type --</option>
              {serviceTypes[vehicleType].map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedService && (
          <div>
            <h2>Selected Details:</h2>
            <p>
              <strong>Vehicle Type:</strong> {vehicleType}
            </p>
            <p>
              <strong>Selected Model:</strong> {selectedModel}
            </p>
            <p>
              <strong>Service Type:</strong> {selectedService}
            </p>
          </div>
        )}

        <button type="submit">Submit</button>
      </form>

      {submitted && <p>Thank you for submitting your vehicle service selection!</p>}
    </div>
  );
};

export default VehicleServiceSelector;