import { startPortTransport } from "../../implementation/abstractions/messaging/page-to-worker-transport/port-transport";
import { startRuntimeSendmessageTransport } from "../../implementation/abstractions/messaging/page-to-worker-transport/runtime-sendmessage-transport";
import { PageToWorkerMessageListener } from "../../implementation/abstractions/messaging/page-to-worker-transport/transport-interface";
import { BrowserApi } from "../types/browser/browser-api";
import {
  DISPATCHER_MESSAGE_IDENTIFIER,
  isMessageSentToDispatcher,
  MessageReceivedFromDispatcher,
} from "./dispatcher-message";
export const startDispatcher = (browserApi: BrowserApi) => {
  const allowedPortNamePrefix = DISPATCHER_MESSAGE_IDENTIFIER;
  const portTransport = startPortTransport(browserApi, allowedPortNamePrefix);
  const sendMessageTransport = startRuntimeSendmessageTransport(browserApi);
  const listener: PageToWorkerMessageListener = (
    messageSentToDispatcher,
    sender,
    sendResponse
  ) => {
    const tabId = sender.tab?.id;
    if (
      !(
        tabId &&
        typeof sender.frameId === "number" &&
        isMessageSentToDispatcher(messageSentToDispatcher)
      )
    ) {
      return false;
    }
    const { options } = messageSentToDispatcher;
    const messageToDispatch: MessageReceivedFromDispatcher = {
      options: {
        sourceFrameId: sender.frameId,
        message: options.message,
      },
      identifier: DISPATCHER_MESSAGE_IDENTIFIER,
      parameters: messageSentToDispatcher.parameters,
    };
    portTransport.sendMessage(
      messageToDispatch,
      tabId,
      options.targetFrameId,
      sendResponse
    );
    sendMessageTransport.sendMessage(
      messageToDispatch,
      tabId,
      options.targetFrameId,
      sendResponse
    );
    return true;
  };
  portTransport.setListener(listener);
  sendMessageTransport.setListener(listener);
};
