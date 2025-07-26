import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "./context/AuthContext";

import Logo from "../assets/Cat Illustration.png"; // Adjust the path as necessary

const Home = () => {
  const { userEmail, isLoading, logout } = useAuth();
  const [fontsLoaded] = useFonts({
    "Atma-Bold": require("../assets/fonts/Atma Bold.ttf"), // doesn't work :(
  });

  // Animation value for the floating effect
  const floatAnimation = useRef(new Animated.Value(0)).current;

  // State for button hover effects
  const [browseHover, setBrowseHover] = useState(false);
  const [galleryHover, setGalleryHover] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !userEmail) {
      router.replace("/login");
    }
  }, [isLoading, userEmail]);

  // Animation effect
  useEffect(() => {
    // Create a looping animation that goes up and down
    const startFloating = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnimation, {
            toValue: -15, // Move up 15 pixels
            duration: 2000, // 2 seconds to go up
            useNativeDriver: true,
          }),
          Animated.timing(floatAnimation, {
            toValue: 0, // Move back to original position
            duration: 2000, // 2 seconds to go down
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startFloating();
  }, [floatAnimation]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!userEmail) {
    return null;
  }

  // Handle press button link
  const onPressButton = (buttonName) => {
    if (buttonName === "Browse") {
      console.log("Browse button pressed!");
      setBrowseHover(true);
      router.push("/browse");
    } else if (buttonName === "Gallery") {
      console.log("Gallery button pressed!");
      setGalleryHover(true);
      router.push("/gallery");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Style</Text>

      <Animated.Image
        source={Logo}
        style={[
          styles.image,
          {
            transform: [{ translateY: floatAnimation }],
          },
        ]}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={[styles.button, browseHover && { backgroundColor: "#90EE90" }]}
        onPressIn={() => onPressButton("Browse")}
        onPressOut={() => setBrowseHover(false)}
      >
        <Text style={styles.buttonText}>Browse</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: "#FF6D6D" },
          galleryHover && { backgroundColor: "#90EE90" },
        ]}
        onPressIn={() => onPressButton("Gallery")}
        onPressOut={() => setGalleryHover(false)}
      >
        <Text style={styles.buttonText}>Gallery</Text>
      </TouchableOpacity>
      <View style={styles.userInfo}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFC688",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Atma-Bold", // Now matches the key we used in useFonts
    color: "black",
    marginBottom: 40,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: "black",
  },
  button: {
    backgroundColor: "#6D9BFF",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "black",
    padding: 16,
    width: "80%",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 16,
    color: "black",
    marginTop: 16,
  },
  userInfo: {
    marginTop: 20,
    alignItems: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "black",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#FF6D6D",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
