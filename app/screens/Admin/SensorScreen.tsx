import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import supabase from "../../supabase";

// Define Navigation Type
type RootStackParamList = {
  SensorView: { nodeId: string };
};

type SensorViewNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SensorView"
>;

type SensorViewRouteProp = RouteProp<RootStackParamList, "SensorView">;

type Props = {
  navigation: SensorViewNavigationProp;
  route: SensorViewRouteProp;
};

const SensorView: React.FC<Props> = ({ navigation, route }) => {
  const { nodeId } = route.params;
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSensors();
  }, []);

  // Fetch sensors for the given node_id
  const fetchSensors = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("sensors") 
      .select("*")
      .eq("node_id", nodeId);

    if (error) {
      console.error("Error fetching sensors:", error.message);
      Alert.alert("Error", "Failed to fetch sensors!");
    } else {
      setSensors(data || []);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensors for Node: {nodeId}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : sensors.length === 0 ? (
        <Text style={styles.noSensorsText}>No sensors found for this node.</Text>
      ) : (
        <FlatList
          data={sensors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title title={`Sensor: ${item.sensor_name}`} titleStyle={styles.cardTitle} />
              <Card.Content>
                <Text style={styles.cardText}>Type: {item.sensor_type}</Text>
                <Text style={styles.cardText}>Value: {item.sensor_value} {item.unit}</Text>
                <Text style={styles.cardText}>Created At: {new Date(item.created_at).toLocaleString()}</Text>
              </Card.Content>
            </Card>
          )}
        />
      )}

      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Back to Nodes
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  noSensorsText: {
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

export default SensorView;
