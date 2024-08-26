import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Component for protected routes
const ProtectedRoute = () => {
  const token = useSelector((state) => state.auth.token); // Directly get the token
  //const location = useLocation();

  return token ? <Outlet /> : <Navigate to="/login" />;
  // If there is no token, redirect to login and preserve the current location
};

export default ProtectedRoute;

// import React from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";

// // Component for protected routes
// const ProtectedRoute = () => {
//   let auth = useSelector((state) => state.auth.token);
//   const location = useLocation();

//   return auth.token ? <Outlet /> : <Navigate to="/signin" />;
//   // If there is no token, redirect to login and preserve the current location
//   // if (!token) {
//   //   return <Navigate to="/signin" state={{ from: location }} replace />;
//   // }
//   // return children;
//   //return <Element />;
// };

// export default ProtectedRoute;
