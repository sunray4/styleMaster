import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Login = () => {
  return (
    <View styles={styles.container}>
      <Text>Login</Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1, // This makes the View fill the entire screen
    backgroundColor: "#ADD8E6", // Light Blue background color
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  text: {
    fontSize: 24,
    color: "white",
  },
});
