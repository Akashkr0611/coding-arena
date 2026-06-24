import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const PreferencesContext = createContext<any>(null);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("userPreferences");
    return saved ? JSON.parse(saved) : {
      lowCrowd: false,
      scenic: false,
      adventure: false,
      safe: false
    };
  });

  useEffect(() => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
  }, [preferences]);

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
