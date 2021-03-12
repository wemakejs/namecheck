import { createContext } from "react";

export enum Language {
  en = "en",
}

export const LanguageContext = createContext({
  language: Language.en,
  setLanguage: (language: Language) => {},
});
