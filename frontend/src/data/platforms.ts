interface Platform {
  id: string;
  getURL: (username: string) => string;
  isValid: (username: string) => boolean;
  selectedByDefault: boolean;
}
interface PlatformGroup {
  id: string;
  platforms: Platform[];
}

const isValidDomain = (domain: string) => {
  return !!domain.toLowerCase().match(/^[a-z0-9]+(-[a-z0-9]+)*$/);
};

export const platformGroups: PlatformGroup[] = [
  {
    id: "domainNames",
    platforms: [
      {
        id: "com",
        getURL: (domain) => `http://${domain}.com`,
        isValid: isValidDomain,
        selectedByDefault: true,
      },
      {
        id: "net",
        getURL: (username) => `http://${username}.net`,
        isValid: isValidDomain,
        selectedByDefault: true,
      },
      {
        id: "org",
        getURL: (username) => `http://${username}.org`,
        isValid: isValidDomain,
        selectedByDefault: true,
      },
      {
        id: "co",
        getURL: (username) => `http://${username}.co`,
        isValid: isValidDomain,
        selectedByDefault: true,
      },
      {
        id: "cc",
        getURL: (username) => `http://${username}.cc`,
        isValid: isValidDomain,
        selectedByDefault: true,
      },
      {
        id: "io",
        getURL: (username) => `http://${username}.io`,
        isValid: isValidDomain,
        selectedByDefault: true,
      },
      {
        id: "me",
        getURL: (username) => `http://${username}.me`,
        isValid: isValidDomain,
        selectedByDefault: true,
      },
      {
        id: "bio",
        getURL: (username) => `http://${username}.bio`,
        isValid: isValidDomain,
        selectedByDefault: true,
      },
      {
        id: "app",
        getURL: (username) => `http://${username}.app`,
        isValid: isValidDomain,
        selectedByDefault: true,
      },
      {
        id: "page",
        getURL: (username) => `http://${username}.page`,
        isValid: isValidDomain,
        selectedByDefault: true,
      },
      {
        id: "zone",
        getURL: (username) => `http://${username}.zone`,
        isValid: isValidDomain,
        selectedByDefault: true,
      },
      {
        id: "tech",
        getURL: (username) => `http://${username}.tech`,
        isValid: isValidDomain,
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
        // TODO: add username validator
        isValid: (username) => true,
        selectedByDefault: true,
      },
      {
        id: "instagram",
        getURL: (username) => `http://instagram.com/${username}`,
        // TODO: add username validator
        isValid: (username) => true,
        selectedByDefault: true,
      },
      {
        id: "twitter",
        getURL: (username) => `http://twitter.com/${username}`,
        isValid: (username) => !!username.match(/^[A-Za-z0-9_]{1,15}$/),
        selectedByDefault: true,
      },
      {
        id: "tiktok",
        getURL: (username) => `https://www.tiktok.com/@${username}`,
        // TODO: add username validator
        isValid: (username) => true,
        selectedByDefault: true,
      },
      {
        id: "reddit",
        getURL: (username) => `http://www.reddit.com/user/${username}`,
        // TODO: add username validator
        isValid: (username) => true,
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
        // TODO: add username validator
        isValid: (username) => true,
        selectedByDefault: true,
      },
      {
        id: "twitch",
        getURL: (username) => `https://www.twitch.tv/${username}`,
        // TODO: add username validator
        isValid: (username) => true,
        selectedByDefault: true,
      },
    ],
  },
  {
    id: "productivity",
    platforms: [
      {
        id: "medium",
        getURL: (username) => `https://medium.com/@${username}`,
        // TODO: add username validator
        isValid: (username) => true,
        selectedByDefault: true,
      },
      {
        id: "github",
        getURL: (username) => `https://www.github.com/${username}`,
        // TODO: add username validator
        isValid: (username) => true,
        selectedByDefault: true,
      },
      {
        id: "patreon",
        getURL: (username) => `https://www.patreon.com/${username}`,
        // TODO: add username validator
        isValid: (username) => true,
        selectedByDefault: true,
      },
    ],
  },
];
