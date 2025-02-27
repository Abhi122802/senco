import React, { useState } from "react";
import { View, StyleSheet, Image, Alert, TouchableOpacity, Dimensions } from "react-native";
import { Text, TextInput, Button, Card, Switch, Dialog, Portal, IconButton } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeContext } from "../../../constants/ThemeContext";
import supabase from "../../supabase";

// Define Navigation Type
type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;  
  AdminDashboard: undefined;
  UserDashboard: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const screenWidth = Dimensions.get("window").width;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isDarkMode, toggleTheme } = useThemeContext();

  // Custom Dialog Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");

  const showAlert = (title: string, message: string, type: "success" | "error" | "info") => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Error", "Please enter email and password!", "error");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        showAlert("Login Failed", "Invalid email or password!", "error");
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        showAlert("Login Failed", "User ID not found!", "error");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (userError || !userData) {
        showAlert("Login Failed", "User data not found!", "error");
        return;
      }

      showAlert("Login Successful", `Welcome, ${userData.role}!`, "success");

      if (userData.role === "admin") {
        navigation.reset({ index: 0, routes: [{ name: "AdminDashboard" }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: "UserDashboard" }] });
      }
    } catch (error: any) {
      showAlert("Login Failed", "An unexpected error occurred.", "error");
    }
  };

  const getIcon = () => {
    switch (alertType) {
      case "success":
        return "check-circle";
      case "error":
        return "alert-circle";
      default:
        return "information";
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#121212" : "#f5f5f5" },
      ]}
    >
      <View style={styles.topRightContainer}>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />

      <Card
        style={[
          styles.card,
          { backgroundColor: isDarkMode ? "#1e1e1e" : "#fff" },
        ]}
      >
        <Card.Title
          title="Welcome Back!"
          titleStyle={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}
        />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          {/* Forgot Password Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPasswordScreen")}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Login
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate("RegisterScreen")}
            style={styles.registerButton}
          >
            Register
          </Button>
        </Card.Content>
      </Card>

      {/* Custom Alert Dialog */}
      <Portal>
        <Dialog visible={alertVisible} onDismiss={() => setAlertVisible(false)}>
          <Dialog.Title style={styles.dialogTitle}>
            <IconButton 
              icon={getIcon()} 
              size={30} 
              iconColor={alertType === "success" ? "green" : alertType === "error" ? "red" : "blue"} 
              style={styles.dialogIcon}
            />
            {alertTitle}
          </Dialog.Title>
          <Dialog.Content>
            <Text>{alertMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAlertVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  topRightContainer: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  card: {
    width: screenWidth > 400 ? 400 : "90%", // Adjust width dynamically
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  forgotText: {
    color: "#6200ea",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  button: {
    marginTop: 10,
  },
  registerButton: {
    marginTop: 10,
  },
  dialogTitle: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 20,
  },
  dialogIcon: {
    marginRight: 10,
  },
});

export default LoginScreen;
