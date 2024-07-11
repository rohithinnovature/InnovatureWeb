// AuthContext.jsx
import React, { createContext, useRef, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const authenticatedUser = useRef(null)

//   const login = (username) => {
//     setAuthenticatedUser(username);
//   };

//   const logout = () => {
//     setAuthenticatedUser(null);
//   };
  const setUsrr=(user)=> {
    console.log("setting value :"+user);
    authenticatedUser.current = user
  }

  return (
    <AuthContext.Provider value={{ authenticatedUser,setUsrr }}>
      {children}
    </AuthContext.Provider>
  );
};

// export const useAuth = () => useContext(AuthContext);
export { AuthContext };

