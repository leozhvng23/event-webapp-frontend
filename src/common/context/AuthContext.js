import React, { createContext, useState, useEffect, useContext } from "react";
import { Auth } from "aws-amplify";

const AuthContext = createContext({
  isLoggedIn: false,
  currentUser: null,
  shouldPoll: false,
  setIsLoggedIn: () => {},
  setCurrentUser: () => {},
  setShouldPoll: () => {},
  signIn: () => {},
  signOut: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [shouldPoll, setShouldPoll] = useState(false);
  const [lastSelectedTab, setLastSelectedTab] = useState("ALL");

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.log("User not logged in or Error getting authentication data:", error);
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    };
    fetchAuthData();
  }, [setIsLoggedIn, setCurrentUser]);

  const signIn = async (username, password) => {
    let user = null;
    try {
      user = await Auth.signIn(username, password);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setShouldPoll(false); // change this to disable/enable polling
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
      setShouldPoll(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        setCurrentUser,
        signIn,
        signOut,
        shouldPoll,
        setShouldPoll,
        lastSelectedTab,
        setLastSelectedTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
