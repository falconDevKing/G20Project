// hooks/useLargeScreen.ts
import { useState, useEffect } from "react";
import defaultTheme from "tailwindcss/defaultTheme";

const breakpoints = defaultTheme.screens;

const useLargeScreen = (): boolean => {
  const [largeScreen, setLargeScreen] = useState<boolean>(true);

  const handleResize = () => {
    const largeScreenValue = window.innerWidth >= +breakpoints.md.split("px")[0];
    setLargeScreen(largeScreenValue);
  };

  useEffect(() => {
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return largeScreen;
};

export default useLargeScreen;
