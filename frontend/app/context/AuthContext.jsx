import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // check if user is alr logged in
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem("userEmail");
      if (savedEmail) {
        setUserEmail(savedEmail);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email) => {
    try {
      await AsyncStorage.setItem("userEmail", email);
      setUserEmail(email);
    } catch (error) {
      console.error("Error saving login:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userEmail");
      setUserEmail(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const value = {
    userEmail,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
