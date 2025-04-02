"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null); // Null initially to avoid mismatch

  useEffect(() => {
    // Load theme from localStorage or default to light
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);

    // Apply the theme class to the HTML element
    const html = document.documentElement;
    html.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Update the theme on the HTML element and localStorage
    const html = document.documentElement;
    html.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Prevent rendering until theme is determined
  if (!theme) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-black dark:bg-gray-200 transition duration-300"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-white" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-600 font-bold" />
      )}
    </button>
  );
}
