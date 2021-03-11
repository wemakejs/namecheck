const GET = (URL: string) => fetch(URL, { method: "GET" });

export const checkers = {
  instagram: {
    fn: async (name: string) => {
      const res = await GET(`https://something.com/${name}/`);
      return false;
    },
  },
};
