// utils/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './auth';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  if(!user){
    return <Navigate to="/" />;
  }
  if(!user.verified){
    return <Navigate to="/mfa" />;
  }
  return children;
}
export default PrivateRoute;