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
  // Get screen width for responsive grid
  const screenWidth = Dimensions.get("window").width;
  const imageSize = (screenWidth - 48) / 3; // 3 columns with padding

  // Function to get all available images
  // Simply update this array when you add new images
  const getAvailableImages = () => {
    const imageFiles = [
      "image_0.jpg",
      "image_1.jpg",
      "image_2.jpg",
      "image_3.jpg",
      "image_4.jpg",
      "image_5.jpg",
      "image_6.jpg",
      "image_7.jpg",
      "image_8.jpg",
      "image_9.jpg",
      "image_10.jpg",
      "image_11.jpg",
      "image_12.jpg",
      "image_13.jpg",
      "image_14.jpg",
      "image_15.jpg",
      "image_16.jpg",
      "image_17.jpg",
      "image_18.jpg",
      "image_19.jpg",
      "image_20.jpg",
      "image_21.jpg",
      "image_22.jpg",
      "image_23.jpg",
      "image_24.jpg",
      "image_25.jpg",
      "image_26.jpg",
      // Add new image filenames here when you add more images
    ];

    return imageFiles.map((filename, index) => ({
      id: index,
      source: `../../backend/images/${filename}`,
      filename: filename,
    }));
  };

  const images = getAvailableImages();
  const imageCount = images.length;
  const renderImageGrid = () => {
    const rows = [];
    for (let i = 0; i < images.length; i += 3) {
      const rowImages = images.slice(i, i + 3);
      rows.push(
        <View key={i} style={styles.imageRow}>
          {rowImages.map((image) => (
            <TouchableOpacity key={image.id} style={styles.imageContainer}>
              <Image
                source={{ uri: image.source }}
                style={[
                  styles.gridImage,
                  { width: imageSize, height: imageSize },
                ]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
          {/* Add empty containers if row is not complete */}
          {rowImages.length < 3 &&
            Array.from({ length: 3 - rowImages.length }).map((_, index) => (
              <View
                key={`empty-${i}-${index}`}
                style={[
                  styles.imageContainer,
                  { width: imageSize, height: imageSize },
                ]}
              />
            ))}
        </View>
      );
    }
    return rows;
  };
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

      {/* Scrollable Image Grid */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>{renderImageGrid()}</View>
      </ScrollView>
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
