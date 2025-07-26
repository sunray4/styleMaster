import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const Browse = () => {
  const address = "https://ef7cb4d3179c.ngrok-free.app";
  const [showPreferenceModal, setShowPreferenceModal] = useState(true);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedFormality, setSelectedFormality] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [carouselDataTops, setCarouselDataTops] = useState([]);
  const [carouselDataBottoms, setCarouselDataBottoms] = useState([]);

  const renderCarouselItem = ({ item }) => (
    <TouchableOpacity style={styles.carouselItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
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
      const response = await fetch(
        address +
          "/scrape_images?gender=" +
          selectedGender +
          "&formality=" +
          selectedFormality,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setLoadingMessage("Styles fetched!!");
        const responseData = await response.json();

        // Convert base64 data to carousel format
        const topsData = responseData.data.tops.map((item, index) => ({
          id: index + 1,
          title: `Top ${index + 1}`,
          image: item.data,
        }));

        const bottomsData = responseData.data.bottoms.map((item, index) => ({
          id: index + 100, // Different ID range for bottoms
          title: `Bottom ${index + 1}`,
          image: item.data,
        }));

        console.log("Received tops:", topsData.length);
        console.log("Received bottoms:", bottomsData.length);
        console.log(
          "Sample top image:",
          topsData[0]?.image?.substring(0, 10) + "..."
        );
        console.log(
          "Sample bottom image:",
          bottomsData[0]?.image?.substring(0, 10) + "..."
        );

        // Update state with the new data
        setCarouselDataTops(topsData);
        setCarouselDataBottoms(bottomsData);

        setTimeout(() => {
          setIsLoading(false);
          setShowPreferenceModal(false);
        }, 1000);
      } else {
        setLoadingMessage("Your request couldn't be processed :(");
        setTimeout(() => {
          setIsLoading(false);
          setShowPreferenceModal(false);
          router.push("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoadingMessage("Your request couldn't be processed :(");
      setTimeout(() => {
        setIsLoading(false);
        setShowPreferenceModal(false);
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
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.homeButtonText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Browse</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Browse Content - Only visible after preferences are set */}
      <View style={styles.content}>
        {/* Carousel Section */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={
              carouselDataTops 
            }
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          />
        </View>

        {/* Second Carousel Section */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={
              carouselDataBottoms
            }
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          />
        </View>
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
        transparent={false}
        onRequestClose={() => setShowPreferenceModal(false)}
      >
        <SafeAreaView style={styles.modalFullScreen}>
          <View style={styles.modalContainer}>
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
                    <TouchableOpacity
                      onPress={() => {
                        router.push("/");
                        setShowPreferenceModal(false);
                      }}
                    >
                      <Text
                        style={[styles.homeButtonText, { marginBottom: 16 }]}
                      >
                        ← Home
                      </Text>
                    </TouchableOpacity>
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
          </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FAE7FF",
    borderRadius: 20,
    width: "90%", // 90% of screen width
    height: "60%", // 60% of screen height
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
    paddingTop: 30,
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
    backgroundColor: "#FFBEBE",
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
    height: "40%",
    marginTop: 20,
  },
  carouselHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
    marginTop: 15,
  },
  carouselContent: {
    paddingHorizontal: 10,
  },
  carouselItem: {
    width: screenWidth * 0.6,
    height: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: 10,
    padding: 12,
    alignItems: "center",
    justifyContent: "space-between",
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
    flex: 1,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: "cover",
  },
  carouselTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
  },
});
