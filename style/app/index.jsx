import { Link } from "expo-router";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

//import Logo from ""; // Adjust the path as necessary

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Style</Text>

      {/* <Image source={Logo} style={styles.image} resizeMode="cover" /> */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Browse</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Gallery</Text>
      </TouchableOpacity>
      <Link href="/login">Login</Link>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ADD8E6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  image: {
    width: 250,
    height: 200,
    borderRadius: 12,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
