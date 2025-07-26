import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import { useFonts, Atma_600SemiBold } from '@expo-google-fonts/atma';

const RootLayout = () => {
  const [loaded] = useFonts( {
    Atma: require("../assets/fonts/Atma Bold.ttf"),
  })
  return (
    <AuthProvider>
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
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
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
    </AuthProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
