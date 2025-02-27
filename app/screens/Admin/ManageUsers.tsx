import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Text, Card, ActivityIndicator, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; 
import supabase from "../../supabase";


interface User {
  user_id: string;
  email: string;
  phone_no: string;
  role: string;
  created_at: string;
}

const ManageUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users") 
        .select("id, userid, email, phoneno, role, createdat");
  
      if (error) {
        console.error("Supabase Fetch Error:", error.message);
        Alert.alert("Error", "Failed to fetch users!");
        return;
      }
  
      const formattedUsers = data.map((user) => ({
        user_id: user.id,
        email: user.email,
        phone_no: user.phoneno,
        role: user.role,
        created_at: user.createdat,
      }));
  
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleUserPress = (user: User) => {
    navigation.navigate("SensorScreen", { userId: user.user_id }); 
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Manage Users
      </Text>

      <Button mode="contained" onPress={fetchUsers} style={styles.refreshButton}>
        Refresh Users
      </Button>

      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#6200ea" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.user_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleUserPress(item)}> {/* 👈 Add Touchable */}
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.email}>
                    {item.email}
                  </Text>
                  <Text variant="bodyMedium">📞 Phone: {item.phone_no}</Text>
                  <Text variant="bodyMedium">🔰 Role: {item.role}</Text>
                  <Text variant="bodySmall" style={styles.date}>
                    📅 Joined: {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default ManageUser;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  refreshButton: {
    marginBottom: 10,
    alignSelf: "center",
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  email: {
    fontWeight: "bold",
    color: "#6200ea",
  },
  date: {
    color: "#666",
    marginTop: 5,
  },
});
