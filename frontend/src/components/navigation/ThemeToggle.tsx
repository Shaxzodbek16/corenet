import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";

type Theme = "light" | "dark" | "system";

const themes = [
  { value: "light" as Theme, label: "Light", icon: Sun },
  { value: "dark" as Theme, label: "Dark", icon: Moon },
  { value: "system" as Theme, label: "System", icon: Monitor }
];

export const ThemeToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme || "system";
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === "system") {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.toggle("dark", systemPreference === "dark");
    } else {
      root.classList.toggle("dark", newTheme === "dark");
    }
    
    localStorage.setItem("theme", newTheme);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    setIsOpen(false);
  };

  const currentThemeData = themes.find(t => t.value === theme);
  const CurrentIcon = currentThemeData?.icon || Monitor;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors"
      >
        <CurrentIcon className="w-4 h-4 text-muted-foreground" />
        <ChevronDown 
          className={`w-3 h-3 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 w-36 bg-background border border-border rounded-lg shadow-card overflow-hidden z-50"
          >
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              return (
                <motion.button
                  key={themeOption.value}
                  whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                  onClick={() => handleThemeChange(themeOption.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    theme === themeOption.value 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{themeOption.label}</span>
                  {theme === themeOption.value && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};