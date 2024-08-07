import { BrowserApi } from "../../../../Api/types/browser/browser-api";
import { PortStore } from "./port-store";
import {
  PageToWorkerMessageListener,
  PageToWorkerTransport,
  WorkerToPageMessageListener,
  WorkerToPageTransport,
} from "./transport-interface";
let portMessageLastId = 0;
interface PortMessageQuery {
  type: "query";
  id: number;
  content: unknown;
}
const isPortMessageQuery = (obj: unknown): obj is PortMessageQuery => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "type" in obj &&
    obj.type === "query" &&
    "id" in obj &&
    typeof obj.id === "number" &&
    "content" in obj
  );
};
interface PortMessageResponse {
  type: "response";
  id: number;
  content: unknown;
}
const isPortMessageResponse = (obj: unknown): obj is PortMessageResponse => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "type" in obj &&
    obj.type === "response" &&
    "id" in obj &&
    typeof obj.id === "number" &&
    "content" in obj
  );
};
const postQuery = (
  port: chrome.runtime.Port,
  message: unknown,
  responseCallback: (response: unknown) => void
) => {
  portMessageLastId++;
  const queryId = portMessageLastId;
  const query: PortMessageQuery = {
    type: "query",
    id: queryId,
    content: message,
  };
  const responseListener = (response: unknown) => {
    if (isPortMessageResponse(response) && response.id === queryId) {
      responseCallback(response.content);
      port.onMessage.removeListener(responseListener);
    }
  };
  port.onMessage.addListener(responseListener);
  port.postMessage(query);
};
const onQueryReceived = (
  message: unknown,
  port: chrome.runtime.Port,
  listener: WorkerToPageMessageListener
): boolean => {
  if (isPortMessageQuery(message)) {
    return listener(message.content, (response) => {
      const wrappedResponse: PortMessageResponse = {
        type: "response",
        id: message.id,
        content: response,
      };
      port.postMessage(wrappedResponse);
    });
  }
  return false;
};
export function connectPortTransport(
  browserApi: BrowserApi,
  portName: string
): PageToWorkerTransport {
  let port: chrome.runtime.Port | undefined = undefined;
  let listener: WorkerToPageMessageListener | undefined = undefined;
  const onMessageListener = (message: unknown) => {
    if (port && listener) {
      return onQueryReceived(message, port, listener);
    }
    return false;
  };
  const onDisconnectListener = () => {
    port?.onMessage.removeListener(onMessageListener);
    port?.onDisconnect.removeListener(onDisconnectListener);
    port = undefined;
    connect();
  };
  const connect = () => {
    if (!port) {
      port = browserApi.runtime.connect({ name: portName });
      port.onMessage.addListener(onMessageListener);
      port.onDisconnect.addListener(onDisconnectListener);
    }
  };
  connect();
  return {
    setListener: (callback) => {
      listener = callback;
    },
    sendMessage: (message, responseCallback) => {
      if (port) {
        postQuery(port, message, responseCallback);
      }
    },
  };
}
export function startPortTransport(
  browserApi: BrowserApi,
  allowedPortNamePrefix: string
): WorkerToPageTransport {
  const openPorts = new PortStore();
  let listener: PageToWorkerMessageListener | undefined = undefined;
  browserApi.runtime.onConnect.addListener((port) => {
    if (!port.name.startsWith(allowedPortNamePrefix)) {
      return;
    }
    openPorts.storePort(port);
    port.onDisconnect.addListener((p) => openPorts.removePort(p));
    port.onMessage.addListener((message) => {
      if (listener) {
        onQueryReceived(message, port, (msg, sendResponse) => {
          if (listener && port.sender) {
            return listener(msg, port.sender, sendResponse);
          }
          return false;
        });
      }
    });
  });
  return {
    setListener: (callback) => {
      listener = callback;
    },
    sendMessage: (message, tabId, frameId, responseCallback) => {
      openPorts
        .getPorts(tabId, frameId)
        .forEach((port) => postQuery(port, message, responseCallback));
    },
  };
}
