"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("id");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("sportify-language");
    if (savedLanguage && (savedLanguage === "id" || savedLanguage === "en")) {
      requestAnimationFrame(() => {
        setLanguage(savedLanguage);
      });
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("sportify-language", lang);
    document.documentElement.lang = lang;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
