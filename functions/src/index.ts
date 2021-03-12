import * as functions from "firebase-functions";

import { checkers } from "./checkers";

export const checkName = functions.https.onCall(async (data, context) => {
  const {
    name,
    platform,
  }: { name: string; platform: keyof typeof checkers } = data;
  const checker = checkers[platform];

  if (
    typeof name !== "string" ||
    typeof platform !== "string" ||
    !name ||
    !platform ||
    !checker
  ) {
    return { error: "Invalid Query" };
  }

  const available = await checker(name);
  return { available };
});
