import React from "react";
import { ThemeProvider } from "../../constants/ThemeContext";
import Navigation from "./_layout"; // Your main navigation

const App = () => {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
};

export default App;
