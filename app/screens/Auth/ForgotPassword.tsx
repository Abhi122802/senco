import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import supabase from "../../supabase";

// Define Navigation Type
type RootStackParamList = {
  LoginScreen: undefined;
};

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

type Props = {
  navigation: ForgotPasswordScreenNavigationProp;
};

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    try {
      // ✅ Check if the user exists in Supabase Auth
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .single();

      if (userError || !userData) {
        Alert.alert("Error", "User not found!");
        return;
      }

      const userId = userData.id;

      // ✅ Update Password in Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (authError) {
        Alert.alert("Error", "Failed to reset password.");
        return;
      }

      // ✅ Update Password in Users Table
      const { error: updateError } = await supabase
        .from("users")
        .update({ password: newPassword })
        .eq("id", userId);

      if (updateError) {
        Alert.alert("Error", "Failed to update password in database.");
        return;
      }

      Alert.alert("Success", "Password reset successfully!", [
        { text: "OK", onPress: () => navigation.navigate("LoginScreen") },
      ]);
    } catch (error: any) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Reset Password" />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <Button mode="contained" onPress={handleResetPassword} style={styles.button}>
            Reset Password
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

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
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default ForgotPasswordScreen;
