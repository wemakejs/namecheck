import * as dns from "dns";
import * as functions from "firebase-functions";
import got, { Response } from "got";
import { chromium } from "playwright";

const log = (
  platform: string,
  username: string,
  available: boolean,
  res?: Response
) => {
  let message: Record<string, any> = {
    platform,
    username,
    available,
  };
  if (res) {
    const requestOptions = JSON.parse(JSON.stringify(res.request.options));
    message = {
      ...message,
      request: {
        method: requestOptions.method,
        headers: requestOptions.headers,
        url: requestOptions.url,
      },
      response: {
        statusCode: res.statusCode,
        headers: res.headers,
      },
    };
  }
  functions.logger.log(platform, message);
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
   * Checking for response status code 200 vs 404 works locally, but becomes a
   * 302 redirect when pushed to cloud functions. Not sure why but suspecting
   * that Instagram thinks the request is from a bot. Using headless browser
   * for now. https://stackoverflow.com/questions/66842438
   */
  instagram: async (username) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.instagram.com/${username}/`);
    const title = await page.title();
    const available = title.toLocaleLowerCase().includes("page not found");
    log("instagram", username, available);
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
   * Checking for response status code 200 vs 404 works locally, but when pushed
   * to cloud functions all response become 200. Using headless browser for now.
   */
  tiktok: async (username) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.tiktok.com/@${username}`);
    const title = await page.title();
    const available = !title.toLocaleLowerCase().includes("tiktok");
    log("tiktok", username, available);
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
