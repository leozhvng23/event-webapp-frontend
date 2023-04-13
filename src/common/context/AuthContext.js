import React, { createContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("User not logged in or Error getting authentication data:", error);
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    };

    fetchAuthData();
  }, []);

  const signIn = async (username, password) => {
    let user = null;
    try {
      user = await Auth.signIn(username, password);
      setCurrentUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
    return user;
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setCurrentUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, currentUser, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
