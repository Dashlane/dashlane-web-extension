import { BrowserApi } from "../../../../Api/types/browser/browser-api";
import {
  PageToWorkerMessageListener,
  PageToWorkerTransport,
  WorkerToPageMessageListener,
  WorkerToPageTransport,
} from "./transport-interface";
export function connectRuntimeSendmessageTransport(
  browserApi: BrowserApi
): PageToWorkerTransport {
  let listener: WorkerToPageMessageListener | undefined = undefined;
  browserApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
    return listener?.(message, sendResponse) ?? false;
  });
  return {
    setListener: (callback) => {
      listener = callback;
    },
    sendMessage: browserApi.runtime.sendMessage,
  };
}
export function startRuntimeSendmessageTransport(
  browserApi: BrowserApi
): WorkerToPageTransport {
  let listener: PageToWorkerMessageListener | undefined = undefined;
  browserApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
    return listener?.(message, sender, sendResponse) ?? false;
  });
  return {
    setListener: (callback) => {
      listener = callback;
    },
    sendMessage: (message, tabId, frameId, responseCallback) => {
      browserApi.tabs.sendMessage(
        tabId,
        message,
        { frameId },
        responseCallback
      );
    },
  };
}
