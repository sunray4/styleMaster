import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "./context/AuthContext";

import { address } from "../address";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const signIn = async () => {
    console.log("signIn function called!");
    console.log("Email:", email);
    console.log("Password:", password);

    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const loginUrl = address + "/login";
      console.log("Attempting login to:", loginUrl);
      console.log("Full URL:", loginUrl);
      console.log("Request payload:", { email: email, password: password });

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const data = await response.json();
      console.log("Response data:", data);

      if (data.status === "success") {
        await login(email);
        router.replace("/");
      } else {
        Alert.alert("Error", data.message || "Login failed");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      Alert.alert("Error", `Network error: ${error.message}`);
      setEmail("");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setShowPassword(!showPassword)}
        >
          <View
            style={[styles.checkbox, showPassword && styles.checkboxChecked]}
          >
            {showPassword && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>View password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.signInButton,
            isLoading && styles.signInButtonDisabled,
          ]}
          onPress={signIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#6D9BFF" />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.label}>
          Don't have an account?{" "}
          <Link href="/signup" style={styles.signUpText}>
            Sign Up
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFC688",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 3,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -4,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#666",
  },
  signUpText: {
    color: "#007AFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  signInButton: {
    backgroundColor: "#6D9BFF",
    borderRadius: 25,
    padding: 16,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
    marginTop: 5,
  },
  signInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  signInButtonDisabled: {
    backgroundColor: "#ccc",
  },
  registerButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPasswordButton: {
    marginTop: 16,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#666",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
