import * as dns from "dns";
import * as functions from "firebase-functions";
import got from "got";
import * as puppeteer from "puppeteer";

const getPage = async (URL: string, launchOptions = {}, gotoOptions = {}) => {
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  await page.goto(URL, gotoOptions);
  return page;
};

type Checker = (
  name: string
) => Promise<{
  available?: boolean;
  error?: boolean;
}>;

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
      return { error: true };
    } catch (e) {
      const { message } = e.response.body.error;
      return { available: message.toLowerCase().includes("do not exist") };
    }
  },

  github: async (name) => {
    const page = await getPage(`https://github.com/${name}/`);
    const title = await page.title();
    return { available: title.toLowerCase().includes("page not found") };
  },

  /**
   * Conveniently, the Instagram website returns status 200 for usernames that
   * exist and 404 for ones that don't. This is all we need.
   */
  instagram: async (name) => {
    try {
      await got(`https://www.instagram.com/${name}/`);
      return { available: false };
    } catch (e) {
      return { available: true };
    }
  },

  twitch: async (name) => {
    const page = await getPage(
      `https://twitch.com/${name}/`,
      {},
      { waitUntil: "networkidle2" }
    );
    const content = await page.content();
    return content.toLowerCase().includes("sorry");
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
      return { error: true };
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
};
