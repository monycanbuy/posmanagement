// tokenUtils.js

import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = (token) => {
  if (!token) return null;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null; 
  } catch (error) {
    console.error("Invalid token",error);
    return null;
  }
};
