import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState } from "react";

import { Link, router } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const Browse = () => {
  const [showPreferenceModal, setShowPreferenceModal] = useState(true);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedFormality, setSelectedFormality] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Sample data for carousel - 6 items
  const carouselData = [
    {
      id: 1,
      title: "Outfit 1",
      image:
        "https://image.hm.com/assets/hm/e8/9c/e89c9bcb140ed5ed4817072a8dbaa209bb2dc24b.jpg?imwidth=657",
    },
    {
      id: 2,
      title: "Outfit 2",
      image:
        "https://image.hm.com/assets/hm/a1/b2/a1b2c3d4e5f6789012345678901234567890abcd.jpg?imwidth=657",
    },
    {
      id: 3,
      title: "Outfit 3",
      image:
        "https://image.hm.com/assets/hm/c3/d4/c3d4e5f6789012345678901234567890abcdef12.jpg?imwidth=657",
    },
    {
      id: 4,
      title: "Outfit 4",
      image:
        "https://image.hm.com/assets/hm/e5/f6/e5f6789012345678901234567890abcdef123456.jpg?imwidth=657",
    },
    {
      id: 5,
      title: "Outfit 5",
      image:
        "https://image.hm.com/assets/hm/g7/h8/g7h8901234567890abcdef123456789012345678.jpg?imwidth=657",
    },
    {
      id: 6,
      title: "Outfit 6",
      image:
        "https://image.hm.com/assets/hm/i9/j0/i9j0abcdef123456789012345678901234567890.jpg?imwidth=657",
    },
  ];

  const renderCarouselItem = ({ item }) => (
    <TouchableOpacity style={styles.carouselItem}>
      <Image source={{ uri: item.image }} style={styles.carouselImage} />
      <Text style={styles.carouselTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const handleDone = async () => {
    console.log("Preferences:", {
      gender: selectedGender,
      formality: selectedFormality,
    });

    setIsLoading(true);
    setLoadingMessage("Loading recommendations...");

    try {
      const response = await fetch("http://192.168.0.123:5000/scrape_images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender: selectedGender,
          formality: selectedFormality,
        }),
      });

      if (response.status === 200) {
        setLoadingMessage("Styles fetched!!");
        setTimeout(() => {
          setIsLoading(false);
          setShowPreferenceModal(false);
        }, 3000);
      } else {
        setLoadingMessage("Your request couldn't be processed :(");
        setTimeout(() => {
          setIsLoading(false);
          router.push("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoadingMessage("Your request couldn't be processed :(");
      setTimeout(() => {
        setIsLoading(false);
        router.push("/");
      }, 3000);
    }
  };

  const renderOptionButtons = (options, selectedValue, onSelect) => {
    return (
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedValue === option && styles.selectedButton,
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selectedValue === option && styles.selectedText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
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
        <Text style={styles.headerTitle}>Browse</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Browse Content - Only visible after preferences are set */}
      <View style={styles.content}>
        <Image
          source={{
            uri: "https://image.hm.com/assets/hm/e8/9c/e89c9bcb140ed5ed4817072a8dbaa209bb2dc24b.jpg?imwidth=657",
          }}
          style={{ width: 200, height: 200 }} // Specify dimensions
        />

        {/* Carousel Section */}
        <View style={styles.carouselContainer}>
          <Text style={styles.carouselHeader}>Recommended for you</Text>
          <FlatList
            data={carouselData}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={false}
            snapToInterval={screenWidth * 0.7 + 20} // Card width + margin
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          />
        </View>

        <Text style={styles.contentText}>Browse content will appear here</Text>
        <Text style={styles.subText}>Your preferences have been saved!</Text>
      </View>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Save fit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, styles.secondButton]}>
          <Text style={styles.bottomButtonText}>See this on me</Text>
        </TouchableOpacity>
      </View>

      {/* Preference Modal Popup */}
      <Modal
        visible={showPreferenceModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowPreferenceModal(false)}
      >
        <SafeAreaView style={styles.modalFullScreen}>
          <ScrollView
            style={styles.modalScrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContent}>
              {isLoading ? (
                // Loading state
                <View style={styles.loadingContainer}>
                  {loadingMessage === "Loading recommendations..." ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                  ) : null}
                  <Text style={styles.loadingText}>{loadingMessage}</Text>
                </View>
              ) : (
                // Normal content
                <>
                  {/* Header */}
                  <Link href="/" style={styles.homeButton}>
                    <Text style={styles.homeButtonText}>← Home</Text>
                  </Link>
                  <Text style={styles.modalHeader}>
                    Do you have any styles in mind today?
                  </Text>

                  {/* Gender Category */}
                  <View style={styles.categoryContainer}>
                    <Text style={styles.categoryTitle}>Gender</Text>
                    {renderOptionButtons(
                      ["All", "Female", "Male"],
                      selectedGender,
                      setSelectedGender
                    )}
                  </View>

                  {/* Formality Category */}
                  <View style={styles.categoryContainer}>
                    <Text style={styles.categoryTitle}>Formality</Text>
                    {renderOptionButtons(
                      ["None", "Casual", "Formal"],
                      selectedFormality,
                      setSelectedFormality
                    )}
                  </View>

                  {/* Done Button */}
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={handleDone}
                  >
                    <Text style={styles.doneButtonText}>Done!</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Browse;

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
  },
  placeholder: {
    width: 60, // Same width as home button to center the title
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 80, // Add space for bottom bar
  },
  contentText: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
  // Modal Styles
  modalFullScreen: {
    flex: 1,
    backgroundColor: "#FFC688",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FFC688",
    borderRadius: 20,
    width: "100%",
    maxHeight: "85%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalScrollContainer: {
    flex: 1,
  },
  modalContent: {
    padding: 30,
    paddingTop: 50,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 28,
  },
  categoryContainer: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    backgroundColor: "white",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  selectedButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionText: {
    fontSize: 14,
    color: "black",
    fontWeight: "500",
  },
  selectedText: {
    color: "white",
    fontWeight: "600",
  },
  doneButton: {
    backgroundColor: "#90E5FF",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "black",
    padding: 16,
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    marginTop: 15,
  },
  doneButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  // Bottom Bar Styles
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#FFC688",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomButton: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 12,
    flex: 1,
    maxWidth: 140,
    alignItems: "center",
    marginHorizontal: 5,
  },
  secondButton: {
    backgroundColor: "#FF6D6D",
  },
  bottomButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
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
    marginTop: 16,
    fontWeight: "500",
  },
  // Carousel Styles
  carouselContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  carouselHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
    marginBottom: 15,
  },
  carouselContent: {
    paddingHorizontal: 10,
  },
  carouselItem: {
    width: screenWidth * 0.7,
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  carouselImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
  },
});
