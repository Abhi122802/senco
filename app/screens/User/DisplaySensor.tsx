import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import supabase from "../../supabase";

// Define Navigation Type
type RootStackParamList = {
  DisplayNode: undefined;
  SensorView: { nodeId: string };
};

type DisplayNodeNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DisplayNode"
>;

type Props = {
  navigation: DisplayNodeNavigationProp;
};

const DisplayNode: React.FC<Props> = ({ navigation }) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAndNodes();
  }, []);

  // Fetch user's email and registered nodes
  const fetchUserAndNodes = async () => {
    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      Alert.alert("Error", "User not logged in!");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;
    setUserEmail(userData.user.email); // Set user email for display

    const { data, error } = await supabase
      .from("nodes") // Ensure this matches your actual table name
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching nodes:", error.message);
      Alert.alert("Error", "Failed to fetch nodes!");
    } else {
      setNodes(data || []);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {userEmail && <Text style={styles.emailText}>User: {userEmail}</Text>} {/* Display logged-in user's email */}
      
      <Text style={styles.title}>Your Registered Nodes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : nodes.length === 0 ? (
        <Text style={styles.noNodesText}>No nodes found! Register one.</Text>
      ) : (
        <FlatList
          data={nodes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title title={`Node ID: ${item.node_id}`} titleStyle={styles.cardTitle} />
              <Card.Content>
                <Text style={styles.cardText}>Phone: {item.phone}</Text>
                <Text style={styles.cardText}>Location: {item.location}</Text>
                <Text style={styles.cardText}>Total Sensors: {item.total_sensors}</Text>
                <Text style={styles.cardText}>Status: {item.status}</Text>
              </Card.Content>
              <Card.Actions>
                <Button 
                  mode="contained" 
                  onPress={() => navigation.navigate("SensorView", { nodeId: item.node_id })}
                >
                  View Sensors
                </Button>
              </Card.Actions>
            </Card>
          )}
        />
      )}

      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Back to Dashboard
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  noNodesText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "#fff",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    marginTop: 20,
    alignSelf: "center",
    width: "60%",
    backgroundColor: "#007AFF",
  },
});

export default DisplayNode;
