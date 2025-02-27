import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import supabase from "../../supabase"; // Ensure Supabase client is correctly imported
import LogoutButton from "../Logout";

// Define Navigation Type
type RootStackParamList = {
  UserDashboard: undefined;
  DisplayNode: undefined;
  RegisterNode: undefined;
};

type UserDashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, "UserDashboard">;

type Props = {
  navigation: UserDashboardNavigationProp;
};

const UserDashboard: React.FC<Props> = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        // ✅ Get the logged-in user's details from Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData.user) {
          Alert.alert("Error", "User not logged in!");
          return;
        }

        const email = authData.user.email; // ✅ Get the email from Supabase Auth
        setUserEmail(email); // ✅ Set the email state
      } catch (error) {
        console.error("Error fetching user email:", error);
        Alert.alert("Error", "Something went wrong while fetching the user email.");
      }
    };

    fetchUserEmail();
  }, []);

  return (
    <View style={styles.container}>
      <LogoutButton />
      <Image source={require("../../../assets/images/administrator.png")} style={styles.logo} />

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome, {userEmail || "User"}! 👋</Text>

      {/* Display Node Card */}
      <Card style={styles.card}>
        <Card.Title title="View Nodes" titleStyle={styles.cardTitle} />
        <Card.Content>
          <Text style={styles.cardText}>View all registered nodes and their details.</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => navigation.navigate("DisplayNode")}>
            Display Node
          </Button>
        </Card.Actions>
      </Card>

      {/* Register Node Card */}
      <Card style={styles.card}>
        <Card.Title title="Register a Node" titleStyle={styles.cardTitle} />
        <Card.Content>
          <Text style={styles.cardText}>Add a new node to the system with required details.</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => navigation.navigate("RegisterNode")}>
            Register Node
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  card: {
    width: "90%",
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
    color: "#555",
  },
});

export default UserDashboard;
