import React, { useState } from "react";
import { View, StyleSheet, Image, Alert, ScrollView, Switch } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import supabase from "../../supabase";
import { useThemeContext } from "../../../constants/ThemeContext"; // ✅ Import Theme Context

// Define Navigation Type
type AuthStackParamList = {
  LoginScreen: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "LoginScreen">;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { isDarkMode, toggleTheme } = useThemeContext(); // ✅ Dark mode context

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string>("user");
  const handleRegister = async () => {
    if (!email || !userId || !phoneNo || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
  
    try {
      // Register user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });
  
      if (error) throw error;
  
      if (data.user) {
        // Insert user details into "users" table
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id, // Supabase Auth-generated user ID
            email: email.trim().toLowerCase(),
            userid: userId.trim(),
            phoneno: phoneNo.trim(),
            password: password.trim(),
            role: role,
            createdat: new Date().toISOString(), // Store timestamp
          },
        ]);
  
        if (insertError) throw insertError;
  
        Alert.alert("Success", "Registration successful!", [
          { text: "OK", onPress: () => navigation.navigate("LoginScreen") },
        ]);
      }
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };
  
  
  
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? "#121212" : "#f5f5f5" }]}>
        {/* ✅ Dark Mode Toggle on the Right Corner */}
        <View style={styles.topRightContainer}>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>

        <Image source={require("../../../assets/images/logo.png")} style={styles.logo} />

        <Card style={[styles.card, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
          <Card.Title title="Create an Account" titleStyle={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]} />
          <Card.Content>
            <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
            <TextInput label="User ID" value={userId} onChangeText={setUserId} mode="outlined" style={styles.input} />
            <TextInput label="Phone Number" value={phoneNo} onChangeText={setPhoneNo} mode="outlined" keyboardType="phone-pad" style={styles.input} />
            <TextInput label="Password" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry style={styles.input} />
            <TextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} mode="outlined" secureTextEntry style={styles.input} />

            <Text style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}>Select Role:</Text>
            <Picker selectedValue={role} style={styles.picker} onValueChange={(itemValue: string) => setRole(itemValue)}>
              <Picker.Item label="User" value="user" />
              {/* <Picker.Item label="Admin" value="admin" /> */}
            </Picker>

            <Button mode="contained" onPress={handleRegister} style={styles.button}>
              Register
            </Button>

            <Button mode="outlined" onPress={() => navigation.navigate("LoginScreen")} style={styles.registerButton}>
              Already have an account? Login
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  topRightContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  picker: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  registerButton: {
    marginTop: 10,
  },
});

export default RegisterScreen;
