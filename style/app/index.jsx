import { Link } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";

import Logo from "../assets/Cat Illustration.png"; // Adjust the path as necessary

const Home = () => {
  const [fontsLoaded] = useFonts({
    "Atma-Bold": require("../assets/fonts/Atma Bold.ttf"), // doesn't work :(
  });

  // Animation value for the floating effect
  const floatAnimation = useRef(new Animated.Value(0)).current;

  // State for button hover effects
  const [browseHover, setBrowseHover] = useState(false);
  const [galleryHover, setGalleryHover] = useState(false);

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
        onPressIn={() => setBrowseHover(true)}
        onPressOut={() => setBrowseHover(false)}
      >
        <Text style={styles.buttonText}>
          <Link href="/browse">Browse</Link>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: "#FF6D6D" },
          galleryHover && { backgroundColor: "#90EE90" },
        ]}
        onPressIn={() => setGalleryHover(true)}
        onPressOut={() => setGalleryHover(false)}
      >
        <Text style={styles.buttonText}>
          <Link href="/gallery">Gallery</Link>
        </Text>
      </TouchableOpacity>
      <Link href="/login">Login</Link>
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
    marginBottom: 30,
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
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    borderWidth: 2,
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
});
