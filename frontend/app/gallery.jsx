import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Link } from "expo-router";

const Gallery = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.homeButton}>
          <Link href="/" style={styles.homeButtonText}>
            ← Home
          </Link>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gallery</Text>
        <View style={styles.placeholder} />
      </View>
    </SafeAreaView>
  );
};

export default Gallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFC688",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFC688",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  homeButton: {
    padding: 8,
  },
  homeButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginRight: 20,
  },
  placeholder: {
    width: 60, // Same width as home button to center the title
  },
  scrollContainer: {
    flex: 1,
  },
  gridContainer: {
    padding: 16,
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E0E0E0",
  },
  gridImage: {
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: "white",
  },
});
