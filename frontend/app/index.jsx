import { router, Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useFonts, Atma_600SemiBold } from '@expo-google-fonts/atma';
import { Nunito_300Light } from '@expo-google-fonts/nunito';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { useAuth } from "./context/AuthContext";

import Logo from "../assets/cat_logo.svg"; // Adjust the path as necessary

const BackgroundPattern = () => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const patternSize = 100;
  const spacing = 60; // Reduced spacing between patterns

  const patterns = [];
  for (let x = 0; x < screenWidth; x += patternSize) {
    for (let y = 0; y < screenHeight; y += patternSize) {
      patterns.push(
        <View
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: patternSize,
            height: patternSize,
          }}
        >
          <Svg width={patternSize} height={patternSize}>
            <Rect
              width={patternSize}
              height={patternSize}
              fill="#FFC688"
              fillOpacity="0.41"
            />
            <Path
              d="M11 0l5 20H6l5-20zm42 31a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM0 72h40v4H0v-4zm0-8h31v4H0v-4zm20-16h20v4H20v-4zM0 56h40v4H0v-4zm63-25a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM53 41a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-30 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-28-8a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zM56 5a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zm-3 46a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM21 0l5 20H16l5-20zm43 64v-4h-4v4h-4v4h4v4h4v-4h4v-4h-4zM36 13h4v4h-4v-4zm4 4h4v4h-4v-4zm-4 4h4v4h-4v-4zm8-8h4v4h-4v-4z"
              fill="#FFE2C0"
              fillOpacity="0.41"
            />
          </Svg>
        </View>
      );
    }
  }

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {patterns}
    </View>
  );
};

const Home = () => {
  const { userEmail, isLoading, logout } = useAuth();

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

  let [fontsLoaded] = useFonts({
    Atma_600SemiBold,
    Nunito_300Light,
  });

  if (!fontsLoaded) {
    return null;
  }


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
      <BackgroundPattern />
      <Text style={[styles.header, { fontFamily: 'Atma_600SemiBold'}]}>Welcome to Style</Text>

      <Animated.View
        style={[
          styles.imageFrame,
          {
            transform: [{ translateY: floatAnimation }],
          },
        ]}
      >
        <Logo width="100%" height="100%" viewBox="0 0 1000 1000" />
      </Animated.View>
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
          { backgroundColor: "#6D9BFF", borderColor: "#355A99" },
          galleryHover && { backgroundColor: "#90EE90" },
        ]}
        onPressIn={() => onPressButton("Gallery")}
        onPressOut={() => setGalleryHover(false)}
      >
        <Text style={styles.buttonText}>Gallery</Text>
      </TouchableOpacity>
      <View>
        <Text>
          <Link href="/testing" style={styles.signUpText}>
            Delete later (testing)
          </Link>
          </Text>
                </View>
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
    position: "relative",
    width: "100%",
    height: "100%",
  },
  header: {
    fontSize: 40,
    color: "black",
    marginBottom: 10,
    textAlign: "center",
  },
  imageFrame: {
    width: 200,
    height: 200,
    overflow: "hidden",
    borderRadius: 100,
    margin: 40,
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
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  button: {
    backgroundColor: "#72B16D", //green
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#4F7A4B",
    padding: 16,
    width: "70%",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Nunito_300Light",
  },
  loadingText: {
    fontSize: 16,
    color: "black",
    marginTop: 16,
  },
  userInfo: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "black",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#EBAF74",
    borderColor: "#B3743E",
    borderWidth: 1,
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
