import * as dns from "dns";
import * as functions from "firebase-functions";
import got from "got";

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
  facebook: async (name) => {
    try {
      await got(`https://graph.facebook.com/v10.0/${name}`, {
        responseType: "json",
      });
      // The request should fail due to missing auth token.
      // The line below shouldn't be reached.
      return { error: 500 };
    } catch (e) {
      const { message } = e.response.body.error;
      return { available: message.toLowerCase().includes("do not exist") };
    }
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  github: async (name) => {
    try {
      await got(`https://github.com/${name}/`);
      return { available: false };
    } catch (e) {
      return { available: true };
    }
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  instagram: async (name) => {
    try {
      await got(`https://www.instagram.com/${name}/`);
      return { available: false };
    } catch (e) {
      return { available: true };
    }
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  reddit: async (name) => {
    try {
      await got(`https://www.reddit.com/user/${name}/`);
      return { available: false };
    } catch (e) {
      return { available: true };
    }
  },

  /**
   * Wasn't able to find a public way to check username, but the Twitch API
   * works with a bearer token. The bearer token has to be acquired through a
   * separate request.
   */
  twitch: async (name) => {
    try {
      const { client_id, client_secret } = functions.config().twitch;
      const tokenRes = await got.post<{ access_token: string }>(
        `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`,
        { responseType: "json" }
      );
      const res = await got<{ data: [] }>(
        `https://api.twitch.tv/helix/users?login=${name}`,
        {
          headers: {
            Authorization: `Bearer ${tokenRes.body.access_token}`,
            "Client-Id": client_id,
          },
          responseType: "json",
        }
      );
      return { available: res.body.data.length === 0 };
    } catch (e) {
      return { error: 500 };
    }
  },

  /**
   * Wasn't able to find a public way to check username, but the Twitter API
   * works with a bearer token.
   */
  twitter: async (name) => {
    try {
      const { bearer_token } = functions.config().twitter;
      const res = await got<{ data?: {} }>(
        `https://api.twitter.com/2/users/by/username/${name}`,
        {
          headers: { Authorization: `Bearer ${bearer_token}` },
          responseType: "json",
        }
      );
      return { available: !res.body.data };
    } catch (e) {
      // Errors are returned with status 200 so should not reach this.
      return { error: 500 };
    }
  },

  /**
   * Check domain by attempting to resolve IPv4 DNS. This is not 100% accurate
   * since a domain owner could have purchased the domain without using it.
   * However, this is very fast and efficient, so going with it until a more
   * accurate method could be found.
   */
  web: async (domainName) => {
    return new Promise((resolve) => {
      dns.resolve4(domainName, (err) => {
        resolve({ available: !!err });
      });
    });
  },

  /**
   * Response status code is 200 for existing user and 404 for non-existing.
   */
  youtube: async (name) => {
    try {
      await got(`https://youtube.com/${name}/`);
      return { available: false };
    } catch (e) {
      return { available: true };
    }
  },
};
