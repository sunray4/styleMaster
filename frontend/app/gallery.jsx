import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";

import DeleteIcon from "../assets/delete.svg";

const Gallery = () => {
  const address = "http://192.168.1.120:8000";
  const [imagesTops, setImagesTops] = useState([]);
  const [imagesBottoms, setImagesBottoms] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = useAuth();
  const userEmail = auth.userEmail;

  let [fontsLoaded] = useFonts({
    Nunito_900Black,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  const getGalleryData = useCallback(async () => {
    try {
      const response = await fetch(address + "/gallery?email=" + userEmail, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
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
  }, [userEmail]);

  useEffect(() => {
    getGalleryData();
  }, [getGalleryData]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const deleteOutfit = async (index) => {
    console.log("Delete button pressed for index:", index);

    const performDelete = async () => {
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

    // Use different confirmation methods for web vs mobile
    if (Platform.OS === "web") {
      // For web, use window.confirm
      const confirmed = window.confirm(
        "Are you sure you want to delete this outfit? This action cannot be undone."
      );
      if (confirmed) {
        await performDelete();
      }
    } else {
      // For mobile, use Alert.alert
      Alert.alert(
        "Delete Outfit",
        "Are you sure you want to delete this outfit? This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: performDelete,
          },
        ]
      );
    }
  };

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

    // Return all containers in a single flex container that will wrap automatically
    return (
      <View style={styles.imageRow}>
        {containers.map((container, index) => (
          <View key={container.id} style={styles.outfitContainer}>
            {/* Top Image */}
            <Image
              source={{ uri: container.top }}
              style={styles.topImage}
              resizeMode="cover"
            />
            {/* Bottom Image */}
            <Image
              source={{ uri: container.bottom }}
              style={styles.bottomImage}
              resizeMode="cover"
            />

            {/* Delete Button - Positioned absolutely to overlap */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteOutfit(container.id)}
            >
              <DeleteIcon width="70%" height="70%" color="#6B7280" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
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
    width: 60,
  },
  scrollContainer: {
    flex: 1,
  },
  gridContainer: {
    padding: 8,
    paddingBottom: 24,
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  outfitContainer: {
    width: 180,
    marginHorizontal: "1%",
    marginBottom: 16,
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
    alignItems: "center",
    justifyContent: "center",
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
    position: "absolute",
    top: 7,
    right: 7,
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 10, // must be above image
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
  topImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: "cover",
  },
  bottomImage: {
    width: "100%",
    height: 250,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    resizeMode: "cover",
  },
});
