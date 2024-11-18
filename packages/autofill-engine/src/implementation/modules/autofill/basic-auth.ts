import { CredentialAutofillView } from "@dashlane/autofill-contracts";
import { browser } from "@dashlane/browser-utils";
import { ParsedURL } from "@dashlane/url-parser";
import {
  AutofillEngineInjectedConnectors,
  State,
} from "../../../Api/server/context";
import { setupConnectors } from "../../../Api/server/start";
import {
  BrowserApi,
  WebRequestOnAuthRequiredOptions,
} from "../../../Api/types/browser/browser-api";
import {
  AutofillEngineExceptionLogger,
  AutofillEngineMessageLogger,
} from "../../../Api/types/logger";
import { logException } from "../../abstractions/logs/exception-logs";
import { getCredentialsAllowedOnThisUrl } from "./autologin";
const basicAuthUrls = ["__REDACTED__"];
const timeoutDurationMs = 3000;
const buildStateForBasicAuth = (): State => {
  return {
    global: {
      get: () => {
        throw new Error(`Global state unavailable in basic auth`);
      },
      set: () => {
        throw new Error(`Global state unavailable in basic auth`);
      },
    },
    tab: {
      get: () => {
        throw new Error(`Persistent tab state unavailable in basic auth`);
      },
      set: () => {
        throw new Error(`Persistent tab state unavailable in basic auth`);
      },
    },
  };
};
class BasicAuthHandlers {
  private readonly _browserApi: BrowserApi;
  private readonly _injectedConnectors: AutofillEngineInjectedConnectors;
  private readonly _logException: AutofillEngineExceptionLogger;
  constructor(
    browserApi: BrowserApi,
    injectedConnectors: AutofillEngineInjectedConnectors,
    basicAuthlogException: AutofillEngineExceptionLogger
  ) {
    this._browserApi = browserApi;
    this._injectedConnectors = injectedConnectors;
    this._logException = basicAuthlogException;
  }
  private readonly _pendingRequestIds: string[] = [];
  public requestCompleted = (
    request: chrome.webRequest.WebResponseCacheDetails
  ) => {
    const requestIndex = this._pendingRequestIds.indexOf(request.requestId);
    if (requestIndex !== -1) {
      this._pendingRequestIds.splice(requestIndex, 1);
    }
  };
  public authRequired = async (
    details: chrome.webRequest.WebAuthenticationChallengeDetails
  ) => {
    const connectors = await setupConnectors(this._injectedConnectors);
    const context = {
      state: buildStateForBasicAuth(),
      browserApi: this._browserApi,
      connectors,
      grapheneClient: connectors.grapheneClient,
      logException: this._logException,
    };
    const loginStatus = await context.connectors.carbon.getUserLoginStatus();
    if (!loginStatus.loggedIn) {
      return {};
    }
    if (this._pendingRequestIds.includes(details.requestId)) {
      return {};
    }
    this._pendingRequestIds.push(details.requestId);
    const timeoutPromise = new Promise<CredentialAutofillView[]>((_, reject) =>
      setTimeout(() => {
        reject(
          new Error(`Credential fetch timed out after ${timeoutDurationMs}ms`)
        );
      }, timeoutDurationMs)
    );
    const credentialPromise = getCredentialsAllowedOnThisUrl(
      context,
      details.url
    );
    const result = (
      await Promise.race([timeoutPromise, credentialPromise])
    ).filter((cred) => cred.autoLogin);
    if (result.length > 0) {
      const credential =
        result.find((cred) => {
          const credURLFullDomain = new ParsedURL(cred.url).getHostname();
          const detailsURLFullDomain = new ParsedURL(details.url).getHostname();
          return credURLFullDomain === detailsURLFullDomain;
        }) ?? result[0];
      return {
        authCredentials: {
          username: credential.login || credential.email,
          password: credential.password,
        },
      };
    }
    return {};
  };
}
export const registerBasicAuthListeners = (
  browserApi: BrowserApi,
  injectedConnectors: AutofillEngineInjectedConnectors,
  messageLogger: AutofillEngineMessageLogger
) => {
  if (browser.isSafari()) {
    return;
  }
  const basicAuthLogException: AutofillEngineExceptionLogger = (
    exception,
    log
  ) => {
    setupConnectors(injectedConnectors).then((connectors) =>
      logException(
        exception,
        "autofillEngineException",
        connectors,
        messageLogger,
        {
          ...log,
          message: `Exception during basic auth process`,
        }
      )
    );
  };
  const handlers = new BasicAuthHandlers(
    browserApi,
    injectedConnectors,
    basicAuthLogException
  );
  const wrappedCompletionHandler = (
    request:
      | chrome.webRequest.WebResponseErrorDetails
      | chrome.webRequest.WebResponseCacheDetails
  ): void => {
    try {
      handlers.requestCompleted(request);
    } catch (exception) {
      basicAuthLogException(exception, {
        fileName: `basicAuth.ts`,
        funcName: `registerBasicAuthListeners`,
      });
    }
  };
  browserApi.webRequest.onCompleted.addListener(
    wrappedCompletionHandler,
    { urls: basicAuthUrls },
    []
  );
  browserApi.webRequest.onErrorOccurred.addListener(wrappedCompletionHandler, {
    urls: basicAuthUrls,
  });
  browserApi.webRequest.onAuthRequired.addListener(
    (details) =>
      handlers.authRequired(details).catch((exception) => {
        basicAuthLogException(exception, {
          fileName: `basicAuth.ts`,
          funcName: `registerBasicAuthListeners`,
        });
        return {};
      }),
    { urls: basicAuthUrls },
    [WebRequestOnAuthRequiredOptions.Blocking]
  );
};
