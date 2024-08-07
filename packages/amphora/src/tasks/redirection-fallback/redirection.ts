import {
  runtimeGetURL,
  tabsUpdate,
  webRequestOnBeforeRequest,
  WebRequestOnBeforeRequestOptions,
} from "@dashlane/webextensions-apis";
import { APP_BASE_URL, CONSOLE_BASE_URL } from "../../constants/dashlane";
import { buildRedirectUrl } from "./build-redirect-url";
const CDN_NO_REDIRECT_REGEX = new RegExp("*****");
const WEBAPP_REDIRECTION_PATTERNS = [
  `${APP_BASE_URL}/*`,
  `${CONSOLE_BASE_URL}/*`,
];
const NITRO_SAML_CALLBACK_URLS = ["*****", "*****"];
const MAIN_FRAME = "main_frame";
const SUB_FRAME = "sub_frame";
function noRedirect(url: string): boolean {
  return (
    url.includes("noredirect") || Boolean(url.match(CDN_NO_REDIRECT_REGEX))
  );
}
function leelooRedirectionHandler(
  requestDetails: chrome.webRequest.WebRequestBodyDetails
): chrome.webRequest.BlockingResponse {
  const { url, tabId } = requestDetails;
  const isSSOUrl = url.includes("/sso");
  if (!noRedirect(url)) {
    void tabsUpdate(tabId, {
      active: !isSSOUrl,
      url: buildRedirectUrl(url),
    });
  }
  return {};
}
function nitroRedirectionHandler(
  requestDetails: chrome.webRequest.WebRequestBodyDetails
): chrome.webRequest.BlockingResponse {
  const { tabId } = requestDetails;
  void tabsUpdate(tabId, {
    active: true,
    url: runtimeGetURL("loading.html"),
  });
  return {
    cancel: true,
  };
}
export const initWebappToExtensionRedirects = (): void => {
  WEBAPP_REDIRECTION_PATTERNS.forEach((patterns) => {
    webRequestOnBeforeRequest.addListener(
      leelooRedirectionHandler,
      {
        urls: [patterns],
        types: [MAIN_FRAME],
      },
      [WebRequestOnBeforeRequestOptions.Blocking]
    );
  });
};
const initNitroSamlToExtensionRedirects = (): void => {
  webRequestOnBeforeRequest.addListener(
    nitroRedirectionHandler,
    {
      urls: NITRO_SAML_CALLBACK_URLS,
      types: [MAIN_FRAME, SUB_FRAME],
    },
    [WebRequestOnBeforeRequestOptions.Blocking]
  );
};
export const initRedirectionFallback = (): void => {
  initWebappToExtensionRedirects();
  initNitroSamlToExtensionRedirects();
};
