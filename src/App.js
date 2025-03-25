import React from "react";
import { BrowserRouter as Router, Route, Routes,} from "react-router-dom";
import Login from "./components/login";
// import Map from "./components/map";
// import BookService from "./components/login";
// import Garage from "./components/selectgarage";
// import LocationBooker from "./components/bookservice";
// import VehicleSelector from "./components/selectgarage";
import ClosestGarageFinder from "./components/closestgarage";
// import GarageRegistration from "./components/registergarage";
// import UserAuth from "./components/userregister";
import Register from "./components/userregister";
import Dashboard from "./components/dashbord";
import RegisterGarage from "./components/registergarage";
// import UserLocationMap from "./components/map";
import UpdateLocation from "./components/map";
import VehicleServiceForm from "./components/bookservice";
// import FindNearbyGarages from "./components/closestgarage";
// import NearbyGarages from "./components/closestgarage";
import ClosestGarage from "./components/closestgarage";
import GarageDashboard from "./components/dasgarage";
import BookingForm from "./components/bookservice";
import GarageList from "./components/garagelist";
import Garages from "./components/garages";
import Booking from "./components/bookservice";
import GarageOwnerDashboard from "./components/dasgarage";
import Garagelogin from "./components/garagelogin";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/booking" element={<Booking/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/garagelogin" element={<Garagelogin/>} />
        <Route path="/findgarage" element={<ClosestGarage/>} />
        <Route path="/selectvehical"  element={ <VehicleServiceForm/>} />
        <Route path="/location"  element={  <UpdateLocation/>} />
        <Route path="/list"  element={  <GarageList/>} />
        <Route path="/gar"  element={  <Garages/>} />
        <Route path="/garage"  element={  <ClosestGarageFinder/>} />
        <Route path="/garageregister"  element={  <RegisterGarage/>} />
        <Route path="/register"  element={  <Register/>} />
        <Route path="/dashboard"  element={ <><Dashboard/><UpdateLocation/></>} />
        <Route path="/garagedashboard"  element={ <GarageOwnerDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;

