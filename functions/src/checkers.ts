import * as dns from "dns";
import * as puppeteer from "puppeteer";

const getPage = async (URL: string, launchOptions = {}, gotoOptions = {}) => {
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  await page.goto(URL, gotoOptions);
  return page;
};

export const checkers: Record<string, (name: string) => Promise<boolean>> = {
  facebook: async (name) => {
    const page = await getPage(`https://facebook.com/${name}/`);
    const title = await page.title();
    return title.toLowerCase().includes("page not found");
  },

  github: async (name) => {
    const page = await getPage(`https://github.com/${name}/`);
    const title = await page.title();
    return title.toLowerCase().includes("page not found");
  },

  instagram: async (name) => {
    const page = await getPage(`https://instagram.com/${name}/`);
    const title = await page.title();
    return title.toLowerCase().includes("page not found");
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

  twitter: async (name) => {
    const page = await getPage(`https://twitter.com/${name}/`);
    const title = await page.title();
    return title.toLowerCase().includes("page not found");
  },

  web: async (name) => {
    return new Promise((resolve) => {
      dns.resolve4(name, (err) => {
        resolve(!!err);
      });
    });
  },
};
