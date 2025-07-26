import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import React from "react";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#ddd" },
        headerTintColor: "#333",
      }}
    >
      {/* Individual Screens */}
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen
        name="browse"
        options={{ title: "Browse", headerShown: false }}
      />
      {/* idk if we want to add our own little header */}
      <Stack.Screen
        name="gallery"
        options={{ title: "Gallery", headerShown: false }}
      />
    </Stack>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
