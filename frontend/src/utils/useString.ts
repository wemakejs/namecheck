import { useContext } from "react";
import { LanguageContext } from "./contexts";

const stringMap: Record<string, Record<string, string>> = {
  en: {
    // sections
    domainNames: "Domain Names",
    socialMedia: "Social Media",
    video: "Video & Streaming",
    productivity: "Productivity",

    // statuses
    available: "Available",
    checking: "Checking...",
    unavailable: "Taken",
    waiting: "...",

    // platforms
    facebook: "Facebook",
    github: "GitHub",
    instagram: "Instagram",
    medium: "Medium",
    patreon: "Patreon",
    reddit: "Reddit",
    slack: "Slack",
    strava: "Strava",
    tiktok: "TikTok",
    twitch: "Twitch",
    twitter: "Twitter",
    username: "Username",
    web: "Web",
    youtube: "YouTube",
  },
};

export const useString = () => {
  const { language } = useContext(LanguageContext);
  const map = stringMap[language] || stringMap.en;

  return (id: string) => {
    return map[id] || stringMap.en[id] || id;
  };
};
