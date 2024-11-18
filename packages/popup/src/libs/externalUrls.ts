import { tabsCreate } from "@dashlane/webextensions-apis";
import { browser } from "@dashlane/browser-utils";
import { kernel } from "../kernel";
const getPaymentUrl = (url: string, safariUrl = "dashlane:///getpremium") =>
  browser.isSafari() ? safariUrl : url;
export const GET_PREMIUM_URL = getPaymentUrl("__REDACTED__");
export const GET_ESSENTIALS_URL = getPaymentUrl("__REDACTED__");
export const FORGOT_PASSWORD_URL = "__REDACTED__";
export const DASHLANE_SSO_LOGGING_IN_URL = "__REDACTED__";
export const DASHLANE_UPDATE_NEEDED = "__REDACTED__";
export const AUTOFILL_CORRECTION_URL = "__REDACTED__";
export const DASHLANE_SUPPORT_PAGE = "__REDACTED__";
export const WHATS_NEW_SUPPORT_URL = "__REDACTED__";
export const PRICING_PAGE_URL = "__REDACTED__";
export const DASHLANE_SSO_MORE_INFO = "__REDACTED__";
export const PASSWORD_LESS_HELP_ARTICLE = "__REDACTED__";
export const DASHLANE_B2B_DIRECT_BUY = "__REDACTED__";
export const openExternalUrl = async (url: string) => {
  if (!url) {
    return;
  }
  try {
    await tabsCreate({ url });
  } catch {
    const newWindow = window.open() || window;
    newWindow.opener = null;
    newWindow.location.replace(url);
  }
  kernel.browser.closePopover();
};
