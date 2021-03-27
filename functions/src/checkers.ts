import * as dns from "dns";
import * as functions from "firebase-functions";
import got, { Response } from "got";

const log = (platform: string, username: string, res: Response | undefined) => {
  functions.logger.log(
    `Checking [${platform}] for username [${username}] finished with status code: [${res?.statusCode}]`
  );
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
    let res: Response<{ error: { message: string } }> | undefined;
    try {
      res = await got(`https://graph.facebook.com/v10.0/${username}`, {
        responseType: "json",
      });
      // The request should fail due to missing auth token.
      // The line below shouldn't be reached.
      return { error: 500 };
    } catch (err) {
      res = err.response;
      const message = res?.body.error.message;
      return { available: message?.toLowerCase().includes("do not exist") };
    } finally {
      log("facebook", username, res);
    }
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  github: async (username) => {
    let res: Response | undefined;
    try {
      res = await got(`https://github.com/${username}/`);
      return { available: false };
    } catch (err) {
      res = err.response;
      return { available: true };
    } finally {
      log("github", username, res);
    }
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  instagram: async (username) => {
    let res: Response | undefined;
    try {
      res = await got(`https://www.instagram.com/${username}/`);
      return { available: false };
    } catch (err) {
      res = err.response;
      return { available: true };
    } finally {
      log("instagram", username, res);
    }
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  medium: async (username) => {
    let res: Response | undefined;
    try {
      res = await got(`https://medium.com/@${username}`);
      return { available: false };
    } catch (err) {
      res = err.response;
      return { available: true };
    } finally {
      log("medium", username, res);
    }
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  patreon: async (username) => {
    let res: Response | undefined;
    try {
      res = await got(`https://www.patreon.com/${username}`);
      return { available: false };
    } catch (e) {
      res = e.response;
      return { available: true };
    } finally {
      log("patreon", username, res);
    }
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  reddit: async (username) => {
    let res: Response | undefined;
    try {
      res = await got(`https://www.reddit.com/user/${username}/`);
      return { available: false };
    } catch (err) {
      res = err.response;
      return { available: true };
    } finally {
      log("reddit", username, res);
    }
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  tiktok: async (username) => {
    let res: Response | undefined;
    try {
      res = await got(`https://www.tiktok.com/@${username}`);
      return { available: false };
    } catch (err) {
      res = err.response;
      return { available: true };
    } finally {
      log("tiktok", username, res);
    }
  },

  /**
   * Wasn't able to find a public way to check username, but the Twitch API
   * works with a bearer token. The bearer token has to be acquired through a
   * separate request.
   */
  twitch: async (username) => {
    let res: Response<{ data: [] }> | undefined;
    try {
      const { client_id, client_secret } = functions.config().twitch;
      const tokenRes = await got.post<{ access_token: string }>(
        `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`,
        { responseType: "json" }
      );
      res = await got<{ data: [] }>(
        `https://api.twitch.tv/helix/users?login=${username}`,
        {
          headers: {
            Authorization: `Bearer ${tokenRes.body.access_token}`,
            "Client-Id": client_id,
          },
          responseType: "json",
        }
      );
      return { available: res.body.data.length === 0 };
    } catch (err) {
      res = err.response;
      functions.logger.error(
        `Error occurred when checking Twitch for username: ${username}`,
        `Status code: ${res?.statusCode}`
      );
      return { error: 500 };
    } finally {
      log("twitch", username, res);
    }
  },

  /**
   * Wasn't able to find a public way to check username, but the Twitter API
   * works with a bearer token.
   */
  twitter: async (username) => {
    let res: Response<{ data?: {} }> | undefined;
    try {
      const { bearer_token } = functions.config().twitter;
      res = await got<{ data?: {} }>(
        `https://api.twitter.com/2/users/by/username/${username}`,
        {
          headers: { Authorization: `Bearer ${bearer_token}` },
          responseType: "json",
        }
      );
      return { available: !res.body.data };
    } catch (err) {
      res = err.response;
      functions.logger.error(
        `Error occurred when checking Twitter for username: ${username}`,
        `Status code: ${res?.statusCode}`
      );
      return { error: 500 };
    } finally {
      log("twitter", username, res);
    }
  },

  /**
   * Check domain by attempting to resolve IPv4 DNS. This is not 100% accurate
   * since a domain owner could have purchased the domain without using it.
   * However, this is very fast and efficient, so going with it until a more
   * accurate method could be found.
   */
  web: async (domainName) => {
    log("web", domainName, undefined);
    return new Promise((resolve) => {
      dns.resolve4(domainName, (err) => {
        resolve({ available: !!err });
      });
    });
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  youtube: async (username) => {
    let res: Response | undefined;
    try {
      res = await got(`https://www.youtube.com/${username}`);
      return { available: false };
    } catch (err) {
      res = err.res;
      return { available: true };
    } finally {
      log("youtube", username, res);
    }
  },
};
