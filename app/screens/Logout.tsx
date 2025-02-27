import React from "react";
import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useThemeContext } from "../../constants/ThemeContext";
import { Text } from "react-native-paper";

const LogoutButton: React.FC = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeContext(); // Detect theme
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleLogout}
          style={[styles.button, isDarkMode ? styles.darkMode : styles.lightMode]}
          activeOpacity={0.8}
        >
          <MaterialIcons name="logout" size={26} color="white" />
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 1000,
    top:30
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 4 },
  },
  darkMode: {
    backgroundColor: "rgba(255, 82, 82, 0.85)", // Glassmorphism Effect
  },
  lightMode: {
    backgroundColor: "rgba(211, 47, 47, 0.9)", // Slightly Transparent Red
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default LogoutButton;
