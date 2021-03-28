import * as dns from "dns";
import * as functions from "firebase-functions";
import got, { Response } from "got";

const log = (
  platform: string,
  username: string,
  available: boolean,
  res?: Response
) => {
  const message: any[] = [
    platform,
    username,
    available ? "available" : "taken",
  ];
  if (res) {
    message.push({
      statusCode: res.statusCode,
      request: {
        options: JSON.parse(JSON.stringify(res.request.options)),
      },
      response: { headers: res.headers },
    });
  }
  functions.logger.log(...message);
};

type CheckerResponse = {
  available?: boolean;
  error?: number;
};
type Checker = (name: string) => Promise<CheckerResponse>;

export const checkers: Record<string, Checker> = {
  /**
   * The Facebook Graph API endpoint https://graph.facebook.com/v10.0/${name}
   * does not work without an authorization token, but nevertheless there is
   * enough information in the error response to determine whether the username
   * is taken or not.
   */
  facebook: async (username) => {
    const res = await got<{ error: { message: string } }>(
      `https://graph.facebook.com/v10.0/${username}`,
      { responseType: "json", throwHttpErrors: false }
    );
    const { message } = res.body.error;
    const available = message.toLowerCase().includes("do not exist");
    log("facebook", username, available, res);
    return { available };
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  github: async (username) => {
    const res = await got(`https://github.com/${username}/`, {
      throwHttpErrors: false,
    });
    const available = res.statusCode === 404;
    log("github", username, available, res);
    return { available };
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  instagram: async (username) => {
    const res = await got(`https://www.instagram.com/${username}/`, {
      throwHttpErrors: false,
    });
    const available = res.statusCode === 404;
    log("instagram", username, available, res);
    return { available };
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  medium: async (username) => {
    const res = await got(`https://medium.com/@${username}`, {
      throwHttpErrors: false,
    });
    const available = res.statusCode === 404;
    log("medium", username, available, res);
    return { available };
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  patreon: async (username) => {
    const res = await got(`https://www.patreon.com/${username}`, {
      throwHttpErrors: false,
    });
    const available = res.statusCode === 404;
    log("patreon", username, available, res);
    return { available };
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  reddit: async (username) => {
    const res = await got(`https://www.reddit.com/user/${username}/`, {
      throwHttpErrors: false,
    });
    const available = res.statusCode === 404;
    log("reddit", username, available, res);
    return { available };
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  tiktok: async (username) => {
    const res = await got(`https://www.tiktok.com/@${username}`, {
      throwHttpErrors: false,
    });
    const available = res.statusCode === 404;
    log("tiktok", username, available, res);
    return { available };
  },

  /**
   * Wasn't able to find a public way to check username, but the Twitch API
   * works with a bearer token. The bearer token has to be acquired through a
   * separate request.
   */
  twitch: async (username) => {
    const { client_id, client_secret } = functions.config().twitch;
    const params = [
      `client_id=${client_id}`,
      `client_secret=${client_secret}`,
      "grant_type=client_credentials",
    ];
    const tokenRes = await got.post<{ access_token: string }>(
      `https://id.twitch.tv/oauth2/token?${params.join("&")}`,
      { responseType: "json", throwHttpErrors: false }
    );
    const res = await got<{ data: [] }>(
      `https://api.twitch.tv/helix/users?login=${username}`,
      {
        headers: {
          Authorization: `Bearer ${tokenRes.body.access_token}`,
          "Client-Id": client_id,
        },
        responseType: "json",
      }
    );
    const available = res.body.data.length === 0;
    log("twitch", username, available, res);
    return { available };
  },

  /**
   * Wasn't able to find a public way to check username, but the Twitter API
   * works with a bearer token.
   */
  twitter: async (username) => {
    const { bearer_token } = functions.config().twitter;
    const res = await got<{ data?: {} }>(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: { Authorization: `Bearer ${bearer_token}` },
        responseType: "json",
        throwHttpErrors: false,
      }
    );
    const available = !res.body.data;
    log("twitter", username, available, res);
    return { available };
  },

  /**
   * Check domain by attempting to resolve IPv4 DNS. This is not 100% accurate
   * since a domain owner could have purchased the domain without using it.
   * However, this is very fast and efficient, so going with it until a more
   * accurate method could be found.
   */
  web: async (domainName) => {
    const available = await new Promise<boolean>((resolve) => {
      dns.resolve4(domainName, (err) => {
        resolve(!!err);
      });
    });
    log("web", domainName, available);
    return { available };
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  youtube: async (username) => {
    const res = await got(`https://www.youtube.com/${username}`, {
      throwHttpErrors: false,
    });
    const available = res.statusCode === 404;
    log("youtube", username, available, res);
    return { available };
  },
};
