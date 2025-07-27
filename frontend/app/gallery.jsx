import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
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
import { useAuth } from "./context/AuthContext";

import Trash from "../assets/trash-can-solid-full.svg";

const Gallery = () => {
  const address = "https://ef7cb4d3179c.ngrok-free.app";
  const [imagesTops, setImagesTops] = useState([]);
  const [imagesBottoms, setImagesBottoms] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = useAuth();
  const userEmail = auth.userEmail;

  const deleteOutfit = async (index) => {
    // Remove the outfit at the specified index
    const newTops = [...imagesTops];
    const newBottoms = [...imagesBottoms];

    newTops.splice(index, 1);
    newBottoms.splice(index, 1);

    setImagesTops(newTops);
    setImagesBottoms(newBottoms);

    try {
      const response = await fetch(
        address + "/gallery-delete?email=" + userEmail + "&index=" + index,
        {
          method: "DELETE",
        }
      );
      const responseData = await response.json();
      console.log("delete response", responseData);
    } catch (error) {
      console.error("Gallery delete error:", error);
    }
  };

  const getGalleryData = async () => {
    // Commenting out backend fetch temporarily
    try {
      const response = await fetch(address + "/gallery?email=" + userEmail, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      console.log("gallery response", responseData);
      if (response.ok) {
        setImagesTops(responseData.data.map((item) => item.top));
        setImagesBottoms(responseData.data.map((item) => item.bottom));
      } else if (response.status === 404) {
        console.log("No gallery data found");
      } else {
        console.error("Failed to fetch gallery data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }

    let [fontsLoaded] = useFonts({
      Nunito_900Black,
      Nunito_700Bold,
      Nunito_600SemiBold,
    });

    if (!fontsLoaded) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

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
    console.log(
      "Rendering grid with tops:",
      imagesTops.length,
      "bottoms:",
      imagesBottoms.length
    );

    if (
      (!imagesTops || imagesTops.length === 0) &&
      (!imagesBottoms || imagesBottoms.length === 0)
    ) {
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
        bottom: imagesBottoms[i] || null,
      });
    }

    const rows = [];
    for (let i = 0; i < containers.length; i += 2) {
      const rowContainers = containers.slice(i, i + 2);
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
                    onError={(error) =>
                      console.error("Top image load error:", error)
                    }
                    onLoad={() => console.log("Top image loaded successfully")}
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>No Top</Text>
                  </View>
                )}
              </View>

              {/* Bottom Image */}
              <View style={[styles.imageContainer, { marginBottom: 8 }]}>
                {container.bottom ? (
                  <Image
                    source={{ uri: container.bottom }}
                    style={styles.gridImageBottom}
                    resizeMode="cover"
                    onError={(error) =>
                      console.error("Bottom image load error:", error)
                    }
                    onLoad={() =>
                      console.log("Bottom image loaded successfully")
                    }
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>No Bottom</Text>
                  </View>
                )}
              </View>

              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteOutfit(container.id)}
              >
                <Trash width="70%" height="70%" />
              </TouchableOpacity>
            </View>
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
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 10,
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
    fontFamily: "Nunito_600SemiBold",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Nunito_900Black",
    color: "black",
    textAlign: "center",
    marginRight: 15,
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
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  outfitContainer: {
    width: "48%",
    marginHorizontal: "1%",
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
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
  },
  gridImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  gridImageBottom: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    resizeMode: "cover",
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
    fontFamily: "Nunito_600SemiBold",
  },
  deleteButton: {
    backgroundColor: "white",
    borderRadius: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  deleteButtonText: {
    fontSize: 18,
    color: "white",
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
    fontFamily: "Nunito_600SemiBold",
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
