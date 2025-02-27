import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, Modal, Dimensions } from "react-native";
import { Text, Card, ActivityIndicator, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import supabase from "../../supabase";

const { width } = Dimensions.get("window");

interface Node {
  id: number;
  user_id: string;
  user_email: string;
  phone: string;
  node_id: string;
  location: string;
  total_sensors: number;
  status: string;
  created_at: string;
}

const ManageNodes: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("nodes").select("*");
      if (error) throw error;
      setNodes(data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch nodes!");
    } finally {
      setLoading(false);
    }
  };

  const deleteNode = async (id: number) => {
    Alert.alert("Confirm", "Are you sure you want to delete this node?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const { error } = await supabase.from("nodes").delete().eq("id", id);
            if (error) throw error;
            Alert.alert("Success", "Node deleted successfully!");
            fetchNodes();
          } catch (error) {
            Alert.alert("Error", "Failed to delete node!");
          }
        },
      },
    ]);
  };

  const openEditModal = (id: number, currentStatus: string) => {
    setSelectedNodeId(id);
    setNewStatus(currentStatus);
    setModalVisible(true);
  };

  const updateNodeStatus = async () => {
    if (!selectedNodeId) return;
    try {
      const { error } = await supabase.from("nodes").update({ status: newStatus }).eq("id", selectedNodeId);
      if (error) throw error;
      Alert.alert("Success", "Node status updated successfully!");
      setModalVisible(false);
      fetchNodes();
    } catch (error) {
      Alert.alert("Error", "Failed to update node status!");
    }
  };

  const viewSensors = (node_id: string) => {
    navigation.navigate("SensorScreen", { node_id });
  };
  

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Manage Nodes 
      </Text>

      <Button mode="contained" onPress={fetchNodes} style={styles.refreshButton} icon="refresh">
        Refresh Nodes
      </Button>

      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#6200ea" />
      ) : (
        <FlatList
          data={nodes}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatList}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.nodeTitle}>
                  🔗 Node ID: {item.node_id}
                </Text>
                <Text variant="bodyMedium">📞 {item.phone}</Text>
                <Text variant="bodyMedium">📍 {item.location}</Text>
                <Text variant="bodyMedium">🛠 Sensors: {item.total_sensors}</Text>
                <Text variant="bodyMedium" style={styles.status}>
                  📊 Status: {item.status}
                </Text>
                <Text variant="bodySmall" style={styles.date}>
                  📅 {new Date(item.created_at).toLocaleDateString()}
                </Text>

                <View style={styles.buttonContainer}>
                  <Button mode="contained" onPress={() => viewSensors(item.node_id)} style={styles.viewButton}>
                    View Sensors
                  </Button>
                  <Button mode="contained" onPress={() => openEditModal(item.id, item.status)} style={styles.editButton}>
                    Edit
                  </Button>
                  <Button mode="contained" onPress={() => deleteNode(item.id)} style={styles.deleteButton}>
                    Delete
                  </Button>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      )}

      {/* Status Edit Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalView}>
          <Card style={styles.modalCard}>
            <Card.Content>
              <Text style={styles.modalTitle}>Update Node Status</Text>
              <Picker
                selectedValue={newStatus}
                onValueChange={(itemValue) => setNewStatus(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Active" value="active" />
                <Picker.Item label="Inactive" value="inactive" />
              </Picker>
              <View style={styles.modalButtons}>
                <Button mode="contained" onPress={updateNodeStatus} style={styles.updateButton}>
                  Update
                </Button>
                <Button onPress={() => setModalVisible(false)}>Cancel</Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

export default ManageNodes;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: "#f4f4f8",
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#6200ea",
    fontSize: width * 0.06,
  },
  refreshButton: {
    marginBottom: 15,
    alignSelf: "center",
    backgroundColor: "#6200ea",
  },
  flatList: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  nodeTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  status: {
    marginTop: 5,
    fontWeight: "bold",
    color: "#388E3C",
  },
  date: {
    color: "#666",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  viewButton: {
    marginStart:-20,
    backgroundColor: "#009688",
  },
  editButton: {
    backgroundColor: "#1976D2",
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  updateButton: {
    backgroundColor: "#0288d1",
  },
});
