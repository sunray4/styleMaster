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
  const [imagesTops, setImagesTops] = useState([]);
  const [imagesBottoms, setImagesBottoms] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGalleryData = async () => {
    // Commenting out backend fetch temporarily
    /*
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
        setImagesTops(data.imagesTops || []);
        setImagesBottoms(data.imagesBottoms || []);
      } else {
        console.error("Failed to fetch gallery data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
    */

    // Hardcoded sample data
    const sampleImageUrl = "https://image.hm.com/assets/hm/44/64/4464618446c394fe79392b81ca8a9eb4e431011f.jpg?imwidth=657";
    const sampleImageUrl2 = "https://image.hm.com/assets/hm/e6/4b/e64bb0639e54f8fe4d3ea1701f8a36aecb41b941.jpg?imwidth=2160";
    const sampleImageUrl3 = "https://image.hm.com/assets/hm/40/f1/40f1d72540c2b82e707251f4d4aafc28817449c0.jpg?imwidth=2160";
    const sampleImageUrl4 = "https://image.hm.com/assets/hm/50/97/5097ac96619bde92de285195f19e3d4ffa642974.jpg?imwidth=2160";

    const sampleTops = [
      sampleImageUrl,
      sampleImageUrl4,
      sampleImageUrl,
      sampleImageUrl,
      sampleImageUrl,
      sampleImageUrl
    ];
    
    const sampleBottoms = [
      sampleImageUrl2,
      sampleImageUrl3,
      sampleImageUrl,
      sampleImageUrl,
      sampleImageUrl,
      sampleImageUrl
    ];

    // Simulate loading delay
    setTimeout(() => {
      setImagesTops(sampleTops);
      setImagesBottoms(sampleBottoms);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getGalleryData();
  }, []);

  const renderImageGrid = () => {
    console.log("Rendering grid with tops:", imagesTops.length, "bottoms:", imagesBottoms.length);

    if ((!imagesTops || imagesTops.length === 0) && (!imagesBottoms || imagesBottoms.length === 0)) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No images available</Text>
        </View>
      );
    }

    // Create containers by pairing tops and bottoms
    const maxLength = Math.max(imagesTops.length, imagesBottoms.length);
    const containers = [];
    
    for (let i = 0; i < maxLength; i++) {
      containers.push({
        id: i,
        top: imagesTops[i] || null,
        bottom: imagesBottoms[i] || null
      });
    }

    const rows = [];
    for (let i = 0; i < containers.length; i += 3) {
      const rowContainers = containers.slice(i, i + 3);
      rows.push(
        <View key={i} style={styles.imageRow}>
          {rowContainers.map((container, index) => (
            <View key={container.id} style={styles.outfitContainer}>
              {/* Top Image */}
              <View style={styles.imageContainer}>
                {container.top ? (
                  <Image
                    source={{ uri: container.top }}
                    style={styles.gridImage}
                    resizeMode="cover"
                    onError={(error) => console.error("Top image load error:", error)}
                    onLoad={() => console.log("Top image loaded successfully")}
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>No Top</Text>
                  </View>
                )}
              </View>
              
              {/* Bottom Image */}
              <View style={[styles.imageContainer, { marginBottom: 0 }]}>
                {container.bottom ? (
                  <Image
                    source={{ uri: container.bottom }}
                    style={styles.gridImage}
                    resizeMode="cover"
                    onError={(error) => console.error("Bottom image load error:", error)}
                    onLoad={() => console.log("Bottom image loaded successfully")}
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>No Bottom</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
          
          {/* Fill empty slots in incomplete rows */}
          {rowContainers.length < 3 &&
            Array(3 - rowContainers.length)
              .fill(null)
              .map((_, index) => (
                <View key={`empty-${i}-${index}`} style={styles.outfitContainer} />
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
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  outfitContainer: {
    flex: 1,
    marginHorizontal: 4,
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    height: 120,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "contain",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  placeholderText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
  },
  emptyText: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
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
