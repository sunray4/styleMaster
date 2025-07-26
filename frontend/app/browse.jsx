import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";

const Browse = () => {
  const [showPreferenceModal, setShowPreferenceModal] = useState(true);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedFormality, setSelectedFormality] = useState(null);

  const handleDone = () => {
    console.log("Preferences:", {
      gender: selectedGender,
      formality: selectedFormality,
    });
    setShowPreferenceModal(false);
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
              {/* Header */}
              <Text style={styles.modalHeader}>
                Do you have any style in mind today?
              </Text>

              {/* Gender Category */}
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>Gender</Text>
                {renderOptionButtons(
                  ["None", "Female", "Male"],
                  selectedGender,
                  setSelectedGender
                )}
              </View>

              {/* Formality Category */}
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>Formality</Text>
                {renderOptionButtons(
                  ["None", "Casual", "Semi-Formal", "Formal"],
                  selectedFormality,
                  setSelectedFormality
                )}
              </View>

              {/* Done Button */}
              <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <Text style={styles.doneButtonText}>Done!</Text>
              </TouchableOpacity>
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
    backgroundColor: "#34C759",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "black",
    padding: 16,
    alignItems: "center",
    marginTop: 15,
  },
  doneButtonText: {
    color: "white",
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
});
