"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Settings {
  compactView: boolean;
  sidebarCollapsed: boolean;
  animations: boolean;
  sidebarPosition: "left" | "right";
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const defaultSettings: Settings = {
  compactView: false,
  sidebarCollapsed: false,
  animations: true,
  sidebarPosition: "left",
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("app-settings");
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        // Use defaults
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("app-settings", JSON.stringify(settings));
    }
  }, [settings, mounted]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
