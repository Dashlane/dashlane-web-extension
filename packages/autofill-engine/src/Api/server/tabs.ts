import { BrowserApi } from "../types/browser/browser-api";
const INJECT_SCRIPT_AUTHORIZED_URLS = ["__REDACTED__", "__REDACTED__"];
const isTabValid = (tab?: chrome.tabs.Tab) => tab?.url && tab.id !== undefined;
export const queryInjectableTabs = (
  browserApi: BrowserApi,
  queryInfo?: chrome.tabs.QueryInfo
) =>
  browserApi.tabs
    .query({
      ...queryInfo,
      url: INJECT_SCRIPT_AUTHORIZED_URLS,
    })
    .then((tabs) => tabs.filter(isTabValid));
export const queryActiveInjectableTabs = (browerApi: BrowserApi) =>
  queryInjectableTabs(browerApi, {
    active: true,
    lastFocusedWindow: true,
  });
