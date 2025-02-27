import React, { createContext, useContext, useState } from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

// Create Theme Context
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Custom Hook for using Theme
export const useThemeContext = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <PaperProvider theme={theme}>{children || <></>}</PaperProvider>
    </ThemeContext.Provider>
  );
};
