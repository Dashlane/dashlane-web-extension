import * as cookie from "cookie";
import { cookiesGetAll } from "@dashlane/webextensions-apis";
import { DASHLANE_DOMAIN } from "../../app/routes/constants";
const cookieName = "userFunnelCookie";
export const getUserFunnelCookieExtension = async () => {
  const userFunnelCookie = await cookiesGetAll({
    domain: DASHLANE_DOMAIN,
    name: cookieName,
  });
  if (userFunnelCookie[0]) {
    const cookieValue = decodeURIComponent(userFunnelCookie[0].value);
    try {
      return JSON.parse(cookieValue);
    } catch (error) {
      return {};
    }
  } else {
    return {};
  }
};
export const getUserFunnelCookieWebsite = () => {
  try {
    const cookies = cookie.parse(document.cookie);
    return JSON.parse(cookies[cookieName]);
  } catch (error) {
    return {};
  }
};
