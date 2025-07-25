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

  // State to store discovered images
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to automatically discover images
  const discoverImages = async () => {
    const discoveredImages = [];
    let index = 0;
    const maxImages = 1000; // Safety limit

    // Test each potential image file
    while (index < maxImages) {
      const imagePath = `../../backend/images/image_${index}.jpg`;

      try {
        // We'll attempt to preload the image to check if it exists
        await new Promise((resolve, reject) => {
          Image.prefetch(imagePath)
            .then(() => {
              discoveredImages.push({
                id: index,
                source: imagePath,
                filename: `image_${index}.jpg`,
              });
              resolve();
            })
            .catch(() => {
              // Image doesn't exist, stop searching
              reject();
            });
        });
        index++;
      } catch (error) {
        // No more images found, break the loop
        break;
      }
    }

    setImages(discoveredImages);
    setLoading(false);
  };

  useEffect(() => {
    discoverImages();
  }, []);

  const renderImageGrid = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading images...</Text>
        </View>
      );
    }

    if (images.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No images found</Text>
        </View>
      );
    }

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
