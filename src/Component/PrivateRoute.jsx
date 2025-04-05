import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    let user=""
    if(localStorage.getItem("weather_user")){
        user = JSON.parse(localStorage.getItem("weather_user"));
    }
  
  return user && user.isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
