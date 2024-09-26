import { defaultTo, isEmpty } from "ramda";
import { looksLikeEmail } from "Utils";
export function normalizeUsernames(
  email: string,
  login: string,
  secondaryLogin: string
) {
  const defaultToEmptyString = defaultTo("");
  let newEmail = email;
  let newLogin = login;
  if (looksLikeEmail(login)) {
    newEmail = login;
    if (!looksLikeEmail(email)) {
      newLogin = email;
    } else {
      newEmail = email;
      newLogin = "";
    }
  } else if (!looksLikeEmail(email)) {
    if (!isEmpty(email)) {
      newLogin = email;
    }
    if (looksLikeEmail(login)) {
      newEmail = login;
    } else {
      if (!isEmpty(login)) {
        newLogin = login;
      }
      newEmail = "";
    }
  }
  return {
    email: defaultToEmptyString(newEmail),
    login: defaultToEmptyString(newLogin),
    secondaryLogin: defaultToEmptyString(secondaryLogin),
  };
}
