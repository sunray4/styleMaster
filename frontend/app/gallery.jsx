import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect, useState } from "react";
import { ActivityIndicator, Image } from "react-native";

const Gallery = () => {
  const address = "https://ef7cb4d3179c.ngrok-free.app";
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGalleryData = async () => {
    try {
      const response = await fetch(address + "/gallery", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        //const images = data.images;
        //return images;
        setImages(data.images || []);
      } else {
        console.error("Failed to fetch gallery data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGalleryData();
  }, []);

  const renderImageGrid = () => {
    const rows = [];
    for (let i = 0; i < images.length; i += 3) {
      const rowImages = images.slice(i, i + 3);
      rows.push(
        <View key={i} style={styles.imageRow}>
          {rowImages.map((image, index) => (
            <View key={i + index} style={styles.imageContainer}>
              <Image
                source={{ uri: image }}
                style={styles.gridImage}
                resizeMode="cover"
              />
            </View>
          ))}
          {/* Fill empty slots in incomplete rows */}
          {rowImages.length < 3 &&
            Array(3 - rowImages.length)
              .fill(null)
              .map((_, index) => (
                <View
                  key={`empty-${i}-${index}`}
                  style={styles.imageContainer}
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
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.homeButtonText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gallery</Text>
        <View style={styles.placeholder} />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading images...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.gridContainer}>
          {renderImageGrid()}
        </ScrollView>
      )}
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
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  homeButtonText: {
    fontSize: 16,
    color: "black",
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
    padding: 8,
    backgroundColor: "white",
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  imageContainer: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E0E0E0",
  },
  gridImage: {
    width: "100%",
    height: "100%",
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
