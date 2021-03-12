import firebase from "firebase/app";

export const checkName = (name: string, platform: string) => {
  const func = firebase.functions().httpsCallable("checkName");
  return func({ name, platform });
};
