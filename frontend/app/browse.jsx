import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import React, { useRef, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Animated,
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
import { useAuth } from "./context/AuthContext";

const { width: screenWidth } = Dimensions.get("window");

const catimg = [
  require('../assets/frames/1.png'),
  require('../assets/frames/2.png'),
  require('../assets/frames/3.png'),
  require('../assets/frames/4.png'),
  require('../assets/frames/5.png'),
  require('../assets/frames/6.png'),
  require('../assets/frames/7.png'),
  require('../assets/frames/8.png'),
];

const Browse = () => {
  const address = "https://ef7cb4d3179c.ngrok-free.app";

  let userEmail = null;
  try {
    const auth = useAuth();
    userEmail = auth.userEmail;
  } catch (error) {
    console.log("Auth context not available:", error);
  }

  const [showPreferenceModal, setShowPreferenceModal] = useState(true);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedFormality, setSelectedFormality] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [carouselDataTops, setCarouselDataTops] = useState([]);
  const [carouselDataBottoms, setCarouselDataBottoms] = useState([]);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const notificationAnimation = useRef(new Animated.Value(-100)).current;

  // State for cat frame animation
  const [currentFrame, setCurrentFrame] = useState(0);

  // Cat frame animation - cycles through catimg array every 250ms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % catimg.length);
    }, 250);

    return () => clearInterval(interval);
  }, []);

  let [fontsLoaded] = useFonts({
    Nunito_900Black,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  const getLink = async (image) => {
    console.log("Getting link for image:", image.substring(0, 50) + "...");
    showNotificationMessage("Fetching shopping link...");
    try {
      // Remove data URL prefix if present
      let no_prefix_image = image;
      if (image.startsWith("data:image/")) {
        const commaIndex = image.indexOf(",");
        no_prefix_image = image.substring(commaIndex + 1);
      }

      const img_response = await fetch(address + "/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: no_prefix_image }),
      });
      const img_data = await img_response.json();
      console.log("img_data:", img_data);
      if (img_response.status === 200) {
        console.log("got image url");
        // comment out to avoid wasting free credits
        // const url_response = await fetch(
        //   address + "/find-match?img_url=" + img_data.image_url
        // );
        // const url_data = await url_response.json();
        // console.log(url_data);
        // Linking.openURL(url_data.match_url);
      } else {
        console.error("upload img error:", img_data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderCarouselItem = ({ item }) => (
    <TouchableOpacity
      style={styles.carouselItem}
      onPress={() => getLink(item.image)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => getLink(item.image)}
      >
        <Text style={styles.carouselTitle}>Shop Now</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const onViewableItemsChanged = ({ viewableItems }, setIndex) => {
    if (viewableItems.length > 0) {
      setIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);

    // Animate notif dropdown
    Animated.timing(notificationAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      // Animate notif back up
      Animated.timing(notificationAnimation, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowNotification(false);
      });
    }, 1200);
  };

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

        // Convert images to carousel format
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

  const saveFit = async (topIndex, bottomIndex) => {
    console.log("Saving fit...");
    const top = carouselDataTops[topIndex];
    const bottom = carouselDataBottoms[bottomIndex];
    try {
      const response = await fetch(address + "/save_fit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          top: top.image,
          bottom: bottom.image,
        }),
      });

      // Log the raw response for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Response was not JSON:", responseText);
        showNotificationMessage("Failed to save fit");
        return;
      }

      if (response.status === 200) {
        console.log("Fit saved!");
        showNotificationMessage("Fit saved in your gallery!");
      } else {
        console.log("Fit not saved: ", responseData.message);
        showNotificationMessage("Failed to save fit");
      }
    } catch (error) {
      console.log("Error: ", error);
      showNotificationMessage("Failed to save fit");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Notification Dropdown */}
      {showNotification && (
        <Animated.View
          style={[
            styles.notificationContainer,
            notificationMessage === "Failed to save fit" && {
              backgroundColor: "#FF8A8A",
            },
            {
              transform: [{ translateY: notificationAnimation }],
            },
          ]}
        >
          <Text style={styles.notificationText}>{notificationMessage}</Text>
        </Animated.View>
      )}
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={[styles.homeButtonText, styles.defaultf]}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Browse</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Browse Content - Only visible after preferences are set */}
      <View style={styles.content}>
        {/* Carousel Section */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={carouselDataTops}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={false}
            snapToInterval={screenWidth * 0.6 + 20}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            onViewableItemsChanged={(info) =>
              onViewableItemsChanged(info, setCurrentTopIndex)
            }
            viewabilityConfig={viewabilityConfig}
          />
        </View>

        {/* Second Carousel Section */}
        <View
          style={[styles.carouselContainer, { height: "50%", marginTop: 20 }]}
        >
          <FlatList
            data={carouselDataBottoms}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={false}
            snapToInterval={screenWidth * 0.6 + 20}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            onViewableItemsChanged={(info) =>
              onViewableItemsChanged(info, setCurrentBottomIndex)
            }
            viewabilityConfig={viewabilityConfig}
          />
        </View>
      </View>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => saveFit(currentTopIndex, currentBottomIndex)}
        >
          <Text style={styles.bottomButtonText}>Save fit</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={[styles.bottomButton, styles.secondButton]}>
          <Text style={styles.bottomButtonText}>See this on me</Text>
        </TouchableOpacity> */}
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
                    
                    <View style={styles.animatedCat}>
                      <Image 
                        source={catimg[currentFrame]}
                        style={styles.catImage}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.loadingTextContainer}>
                      <Text style={styles.loadingText}>{loadingMessage}</Text>
                      {loadingMessage === "Loading recommendations..." ? (
                        <ActivityIndicator size="small" color="#000000" style={styles.loadingSpinner} />
                      ) : null}
                    </View>
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
                    <Text
                      style={[
                        styles.modalHeader,
                        { fontFamily: "Nunito_900Black" },
                      ]}
                    >
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
                        ["All", "Casual", "Formal"],
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
    // borderBottomWidth: 1,
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
    fontFamily: "Nunito_600SemiBold",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Nunito_900Black",
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
    padding: 4,
    paddingBottom: 60, // Add space for bottom bar
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
    backgroundColor: "#FFD19F",
    borderRadius: 20,
    width: "90%", // 90% of screen width
    height: "70%", // 70% of screen height
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
    color: "black",
    textAlign: "left",
    marginBottom: 30,
    lineHeight: 28,
  },
  categoryContainer: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: "Nunito_600SemiBold",
    color: "black",
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    backgroundColor: "#FFD6D7",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E5A4A6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  selectedButton: {
    backgroundColor: "#e47f7fff",
    borderColor: "#b65e5eff",
  },
  optionText: {
    fontSize: 14,
    color: "black",
    fontFamily: "Nunito_600SemiBold",
  },
  selectedText: {
    color: "white",
  },
  doneButton: {
    backgroundColor: "#AEDFF7",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#7AAFC1",
    padding: 16,
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    marginTop: 15,
  },
  doneButtonText: {
    color: "black",
    fontSize: 18,
    fontFamily: "Nunito_900Black",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomButton: {
    backgroundColor: "#AEDFF7",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#7AAFC1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    flex: 1,
    maxWidth: 200,
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  secondButton: {
    backgroundColor: "#FFD6D7",
    borderColor: "#E5A4A6",
  },
  bottomButtonText: {
    color: "black",
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  //  paddingVertical: "0%",
  },
  loadingText: {
    fontSize: 16,
    color: "black",
    marginTop: -20,
    fontFamily: "Nunito_600SemiBold",
  },
  loadingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingSpinner: {
    marginLeft: 10,
    marginTop: -20,
  },
  // Carousel Styles
  carouselContainer: {
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  carouselHeader: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "black",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  carouselContent: {
    paddingHorizontal: (screenWidth - screenWidth * 0.6) / 2.2,
  },
  carouselItem: {
    width: screenWidth * 0.6,
    height: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFD19F",
    marginHorizontal: 10,
    padding: 8,
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
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#6B7280",
    textAlign: "center",
  },
  notificationContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: "#A6FFA6",
    borderRadius: 8,
    padding: 12,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationText: {
    color: "464646",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFD19F",
  },
  shopNowButton: {
    // backgroundColor: "#ccc",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#6B7280",
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 2,
  },
  animatedCat: {
    alignItems: "center",
  },
  catImage: {
    marginTop: 70,
    width: 200,
    height: 200,
  },
});
