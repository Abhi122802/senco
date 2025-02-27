import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeContext } from "../../../constants/ThemeContext";
import LogoutButton from "../Logout"; // Import LogoutButton
// Define Navigation Type
type RootStackParamList = {
  AdminDashboard: undefined;
  ManageNode: undefined;
  ManageUser: undefined;
};

type AdminDashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AdminDashboard"
>;

type Props = {
  navigation: AdminDashboardNavigationProp;
};

const AdminDashboard: React.FC<Props> = ({ navigation }) => {
  const { isDarkMode } = useThemeContext();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#121212" : "#f5f5f5" }]}>
      <LogoutButton />
      {/* Admin Header */}
      <Card style={[styles.card, { backgroundColor: isDarkMode ? "#1e1e1e" : "#fff" }]}>
        <Card.Content style={styles.cardContent}>
          <Image source={require("../../../assets/images/administrator.png")} style={styles.logo} />
          <Text variant="headlineMedium" style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
            Welcome, Admin!
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: isDarkMode ? "#bbb" : "#555" }]}>
            Manage system nodes and users efficiently.
          </Text>
        </Card.Content>
      </Card>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("ManageNode")}
          style={styles.button}
          buttonColor={isDarkMode ? "#bb86fc" : "#6200ea"}
        >
          Manage Nodes
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("ManageUser")}
          style={styles.button}
          buttonColor={isDarkMode ? "#03dac6" : "#03a9f4"}
        >
          Manage Users
        </Button>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    alignItems: "center",
  },
  cardContent: {
    alignItems: "center", // Ensures all content inside the card is centered
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    alignSelf: "center", // Centers the image within its container
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    maxWidth: 400,
  },
  button: {
    marginVertical: 10,
    paddingVertical: 8,
  },
});

export default AdminDashboard;
