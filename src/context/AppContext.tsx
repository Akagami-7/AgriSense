import { createContext, useState, useEffect } from "react";

export const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: any) => {
  const [reports, setReports] = useState<any[]>([]);

  // Persist data (important for demo)
  useEffect(() => {
    const saved = localStorage.getItem("reports");
    if (saved) setReports(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("reports", JSON.stringify(reports));
  }, [reports]);

  return (
    <AppContext.Provider value={{ reports, setReports }}>
      {children}
    </AppContext.Provider>
  );
};