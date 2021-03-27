import * as functions from "firebase-functions";

import { checkers } from "./checkers";

export const checkName = functions.https.onCall(async (data) => {
  const { name, platform, tld = "" } = data;
  const checker = checkers[platform];

  if (
    typeof name !== "string" ||
    typeof platform !== "string" ||
    !name ||
    !platform ||
    (platform === "web" && !tld) ||
    !checker
  ) {
    return { error: "Invalid Query" };
  }

  return await checker(name + tld);
});
