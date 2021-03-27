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

export const checkers: Record<string, (name: string) => Promise<boolean>> = {
  facebook: async (name) => {
    try {
      await got(`https://graph.facebook.com/v10.0/${name}`, {
        responseType: "json",
      });
      return false;
    } catch (e) {
      const { message } = e.response.body.error;
      return message.toLowerCase().includes("do not exist");
    }
  },

  github: async (name) => {
    const page = await getPage(`https://github.com/${name}/`);
    const title = await page.title();
    return title.toLowerCase().includes("page not found");
  },

  instagram: async (name) => {
    try {
      await got(`https://www.instagram.com/${name}/`);
      return false;
    } catch (e) {
      return true;
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
      const res = await got<{ data?: {} }>(
        `https://api.twitter.com/2/users/by/username/${name}`,
        {
          headers: {
            Authorization: `Bearer ${functions.config().twitter.bearer_token}`,
          },
          responseType: "json",
        }
      );
      return !res.body.data;
    } catch (e) {
      // Errors are returned with status 200 so should not reach this.
      return false;
    }
  },

  web: async (name) => {
    return new Promise((resolve) => {
      dns.resolve4(name, (err) => {
        resolve(!!err);
      });
    });
  },
};
