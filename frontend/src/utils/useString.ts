import { useContext } from "react";
import { LanguageContext } from "./contexts";

const stringMap: Record<string, Record<string, string>> = {
  en: {
    available: "Available",
    checking: "Checking...",
    facebook: "Facebook",
    instagram: "Instagram",
    twitter: "Twitter",
    unavailable: "Taken",
    username: "Username",
    waiting: "...",
    web: "Web",
  },
};

export const useString = () => {
  const { language } = useContext(LanguageContext);
  const map = stringMap[language] || stringMap.en;

  return (id: string) => {
    return map[id] || id;
  };
};
