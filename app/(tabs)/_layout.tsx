import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "../../constants/ThemeContext"; // Ensure correct path

import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import AdminDashboard from "../screens/Admin/AdminDashboard";
import ManageNode from "../screens/Admin/ManageNodes";
import ManageUser from "../screens/Admin/ManageUsers";
import SensorScreen from "../screens/Admin/SensorScreen";
import UserDashboard from "../screens/User/UserDashboard";
import DisplayNode from "../screens/User/DisplaySensor";
import SensorView from "../screens/User/SensorView";
import RegisterNode from "../screens/User/RegisterNode";
import ForgotPasswordScreen from "../screens/Auth/ForgotPassword";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="ManageNode" component={ManageNode} />
          <Stack.Screen name="ManageUser" component={ManageUser} />
          <Stack.Screen name="SensorScreen" component={SensorScreen} />
          <Stack.Screen name="SensorView" component={SensorView} />
          <Stack.Screen name="UserDashboard" component={UserDashboard} />
          <Stack.Screen name="DisplayNode" component={DisplayNode} />
          <Stack.Screen name="RegisterNode" component={RegisterNode} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        </Stack.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
