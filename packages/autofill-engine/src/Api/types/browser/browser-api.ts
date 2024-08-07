import {
  contextMenusCreate,
  contextMenusOnClicked,
  contextMenusRemoveAll,
  runtimeConnect,
  runtimeGetURL,
  runtimeOnConnect,
  runtimeOnMessage,
  runtimeSendMessage,
  storageLocalGet,
  storageLocalSet,
  tabsCreate,
  tabsOnHighLighted,
  tabsOnRemoved,
  tabsQuery,
  tabsSendMessage,
  webRequestOnAuthRequired,
  WebRequestOnAuthRequiredOptions,
  webRequestOnCompleted,
  WebRequestOnCompletedOptions,
  webRequestOnErrorOccurred,
} from "@dashlane/webextensions-apis";
interface Listener<T extends Function, Args extends any[] = []> {
  addListener: (callback: T, ...params: Args) => void;
}
interface Tabs {
  create: typeof tabsCreate;
  sendMessage: (
    tabId: number,
    message: unknown,
    options?: chrome.tabs.MessageSendOptions,
    responseCallback?: (response: unknown) => void
  ) => void;
  onHighlighted: Listener<
    (highlightInfo: chrome.tabs.TabHighlightInfo) => void
  >;
  onRemoved: Listener<(tabId: number, removeInfo: unknown) => void>;
  query: typeof tabsQuery;
}
interface Runtime {
  connect: typeof runtimeConnect;
  getURL: (path: string) => string;
  lastError?: chrome.runtime.LastError;
  onConnect: typeof runtimeOnConnect;
  sendMessage: (
    message: unknown,
    responseCallback?: (response: unknown) => void
  ) => void;
  onMessage: Listener<
    (
      request: unknown,
      sender: chrome.runtime.MessageSender,
      response: (response?: unknown) => void
    ) => boolean
  >;
}
interface WebRequest {
  onAuthRequired: Listener<
    (
      details: chrome.webRequest.WebAuthenticationChallengeDetails
    ) => Promise<chrome.webRequest.BlockingResponse>,
    [
      filter: chrome.webRequest.RequestFilter,
      extraInfoSpec: WebRequestOnAuthRequiredOptions[]
    ]
  >;
  onCompleted: Listener<
    (details: chrome.webRequest.WebResponseCacheDetails) => void,
    [
      filter: chrome.webRequest.RequestFilter,
      extraInfoSpec: WebRequestOnCompletedOptions[]
    ]
  >;
  onErrorOccurred: Listener<
    (details: chrome.webRequest.WebResponseErrorDetails) => void,
    [filter: chrome.webRequest.RequestFilter]
  >;
}
export { WebRequestOnAuthRequiredOptions } from "@dashlane/webextensions-apis";
interface Storage {
  local: {
    get: typeof storageLocalGet;
    set: typeof storageLocalSet;
  };
}
interface ContextMenus {
  onClicked: typeof contextMenusOnClicked;
  create: typeof contextMenusCreate;
  removeAll: typeof contextMenusRemoveAll;
}
export interface BrowserApi {
  runtime: Runtime;
  storage: Storage;
  tabs: Tabs;
  webRequest: WebRequest;
  contextMenus: ContextMenus;
  crypto: Crypto;
}
export class WebExtensionApiManager {
  protected browserApi: BrowserApi;
  constructor() {
    this.browserApi = {
      runtime: {
        connect: runtimeConnect,
        getURL: runtimeGetURL,
        onConnect: runtimeOnConnect,
        onMessage: runtimeOnMessage,
        sendMessage: runtimeSendMessage,
      },
      storage: {
        local: {
          get: storageLocalGet,
          set: storageLocalSet,
        },
      },
      tabs: {
        create: tabsCreate,
        sendMessage: tabsSendMessage,
        onHighlighted: tabsOnHighLighted,
        onRemoved: tabsOnRemoved,
        query: tabsQuery,
      },
      webRequest: {
        onAuthRequired: webRequestOnAuthRequired,
        onCompleted: webRequestOnCompleted,
        onErrorOccurred: webRequestOnErrorOccurred,
      },
      contextMenus: {
        onClicked: contextMenusOnClicked,
        create: contextMenusCreate,
        removeAll: contextMenusRemoveAll,
      },
      crypto,
    };
  }
  public getBrowserApi(): BrowserApi {
    return this.browserApi;
  }
}
