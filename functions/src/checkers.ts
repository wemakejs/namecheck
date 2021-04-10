import * as dns from "dns";
import * as functions from "firebase-functions";
import got, { Response } from "got";

const log = (
  platform: string,
  username: string,
  available: boolean,
  res?: Response
) => {
  let details: Record<string, any> = {
    platform,
    username,
    available,
  };
  if (res) {
    const requestOptions = JSON.parse(JSON.stringify(res.request.options));
    details = {
      ...details,
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
  functions.logger.log(
    `${username} is ${available ? "available" : "taken"} on ${platform}`,
    details
  );
};

// "got" without http errors
const safeGet = (url: string) => got(url, { throwHttpErrors: false });

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
    const res = await safeGet(`https://github.com/${username}/`);
    const available = res.statusCode === 404;
    log("github", username, available, res);
    return { available };
  },

  /**
   * Checking for response status code 200 vs 404 works locally, but becomes a
   * 302 redirect when pushed to cloud functions. Not sure why but suspecting
   * that Instagram thinks the request is from a bot. This JSDOM attempt doesn't
   * work either.
   * TODO: figure out how to get around Instagram's redirect
   */
  instagram: async (username) => {
    let available = !username;
    // try {
    //   const resourceLoader = new ResourceLoader({
    //     proxy: "http://127.0.0.1:9001",
    //     strictSSL: false,
    //     userAgent: "Mozilla/5.0",
    //   });
    //   await JSDOM.fromURL(`https://www.instagram.com/${username}/`, {
    //     resources: resourceLoader,
    //   });
    // } catch (err) {
    //   available = true;
    // } finally {
    //   log("instagram", username, available);
    // }
    return { available };
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  medium: async (username) => {
    const res = await safeGet(`https://medium.com/@${username}`);
    const available = res.statusCode === 404;
    log("medium", username, available, res);
    return { available };
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  patreon: async (username) => {
    const res = await safeGet(`https://www.patreon.com/${username}`);
    const available = res.statusCode === 404;
    log("patreon", username, available, res);
    return { available };
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  reddit: async (username) => {
    const res = await safeGet(`https://www.reddit.com/user/${username}/`);
    const available = res.statusCode === 404;
    log("reddit", username, available, res);
    return { available };
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  slack: async (username) => {
    const res = await safeGet(`https://${username}.slack.com/`);
    const available = res.statusCode === 404;
    log("slack", username, available, res);
    return { available };
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  strava: async (username) => {
    const res = await got(`https://www.strava.com/athletes/${username}`, {
      followRedirect: false,
      throwHttpErrors: false,
    });
    const available = res.statusCode === 302;
    log("strava", username, available, res);
    return { available };
  },

  /**
   * Checking for response status code 200 vs 404 works locally, but when pushed
   * to cloud functions all response become 200.
   * TODO: figure out how to check TikTok
   */
  tiktok: async (username) => {
    let available = !username;
    // try {
    //   await JSDOM.fromURL(`https://www.tiktok.com/@${username}`);
    // } catch (err) {
    //   available = true;
    // } finally {
    //   log("tiktok", username, available);
    // }
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
    const res = await safeGet(`https://www.youtube.com/${username}`);
    const available = res.statusCode === 404;
    log("youtube", username, available, res);
    return { available };
  },
};
