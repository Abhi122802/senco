import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Card, Text, ActivityIndicator } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import supabase from "../../supabase";

// Define Navigation Type
type RootStackParamList = {
  RegisterNode: undefined;
  DisplayNode: undefined;
};

type RegisterNodeNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RegisterNode"
>;

type Props = {
  navigation: RegisterNodeNavigationProp;
};

const RegisterNode: React.FC<Props> = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nodeId, setNodeId] = useState("");
  const [location, setLocation] = useState("");
  const [totalSensors, setTotalSensors] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData?.user) {
        Alert.alert("Error", "User not logged in!");
        return;
      }

      setUserId(authData.user.id);
      setUserEmail(authData.user.email);
    };

    fetchUserDetails();
  }, []);

  const handleRegister = async () => {
    if (!phone || !nodeId || !location || !totalSensors) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("nodes")
        .insert([
          {
            user_id: userId,
            user_email: userEmail,
            phone,
            node_id: nodeId,
            location,
            total_sensors: parseInt(totalSensors, 10),
            status: "Pending",
          },
        ])
        .select();

      if (error) {
        console.error("Supabase Insert Error:", error.message);
        Alert.alert("Database Error", error.message);
      } else {
        console.log("Inserted Successfully:", data);
        Alert.alert("Success", "Node registered successfully!");
        navigation.replace("DisplayNode");
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      Alert.alert("Error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Card style={styles.card}>
        <Text style={styles.emailText}>Logged in as: {userEmail}</Text>

        <Card.Content>
          <Text style={styles.title}>Register Node</Text>

          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            label="Node ID"
            value={nodeId}
            onChangeText={setNodeId}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Total Sensors"
            value={totalSensors}
            onChangeText={setTotalSensors}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          {loading ? (
            <ActivityIndicator animating={true} color="#007AFF" size="large" />
          ) : (
            <>
              <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Register
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                contentStyle={styles.buttonContent}
              >
                Cancel
              </Button>
            </>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 15,
    elevation: 8,
    backgroundColor: "white",
  },
  emailText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#007AFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  backButton: {
    marginTop: 10,
    borderColor: "#007AFF",
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
  },
});

export default RegisterNode;
