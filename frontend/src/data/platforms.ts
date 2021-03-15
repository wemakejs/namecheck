interface Platform {
  id: string;
  getURL: (username: string) => string;
  selectedByDefault: boolean;
}
interface PlatformGroup {
  id: string;
  platforms: Platform[];
}

export const platformGroups: PlatformGroup[] = [
  {
    id: "domainNames",
    platforms: [
      {
        id: "com",
        getURL: (username) => `http://${username}.com`,
        selectedByDefault: true,
      },
      {
        id: "net",
        getURL: (username) => `http://${username}.net`,
        selectedByDefault: true,
      },
      {
        id: "org",
        getURL: (username) => `http://${username}.org`,
        selectedByDefault: true,
      },
      {
        id: "co",
        getURL: (username) => `http://${username}.co`,
        selectedByDefault: true,
      },
      {
        id: "cc",
        getURL: (username) => `http://${username}.cc`,
        selectedByDefault: true,
      },
      {
        id: "io",
        getURL: (username) => `http://${username}.io`,
        selectedByDefault: true,
      },
      {
        id: "me",
        getURL: (username) => `http://${username}.me`,
        selectedByDefault: true,
      },
      {
        id: "bio",
        getURL: (username) => `http://${username}.bio`,
        selectedByDefault: true,
      },
      {
        id: "app",
        getURL: (username) => `http://${username}.app`,
        selectedByDefault: true,
      },
      {
        id: "page",
        getURL: (username) => `http://${username}.page`,
        selectedByDefault: true,
      },
      {
        id: "zone",
        getURL: (username) => `http://${username}.zone`,
        selectedByDefault: true,
      },
    ],
  },
  {
    id: "socialMedia",
    platforms: [
      {
        id: "facebook",
        getURL: (username) => `http://facebook.com/${username}`,
        selectedByDefault: true,
      },
      {
        id: "instagram",
        getURL: (username) => `http://instagram.com/${username}`,
        selectedByDefault: true,
      },
      {
        id: "twitter",
        getURL: (username) => `http://twitter.com/${username}`,
        selectedByDefault: true,
      },
    ],
  },
  {
    id: "video",
    platforms: [
      {
        id: "youtube",
        getURL: (username) => `https://www.youtube.com/${username}`,
        selectedByDefault: true,
      },
      {
        id: "twitch",
        getURL: (username) => `https://www.twitch.tv/${username}`,
        selectedByDefault: true,
      },
    ],
  },
  {
    id: "productivity",
    platforms: [
      {
        id: "github",
        getURL: (username) => `https://www.github.com/${username}`,
        selectedByDefault: true,
      },
    ],
  },
];
