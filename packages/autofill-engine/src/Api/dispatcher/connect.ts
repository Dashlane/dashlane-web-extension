import { connectPortTransport } from "../../implementation/abstractions/messaging/page-to-worker-transport/port-transport";
import { connectRuntimeSendmessageTransport } from "../../implementation/abstractions/messaging/page-to-worker-transport/runtime-sendmessage-transport";
import { BrowserApi } from "../types/browser/browser-api";
import { AutofillEngineClientType } from "../types/client-type";
import {
  DISPATCHER_MESSAGE_IDENTIFIER,
  DispatcherCallbackOptions,
  DispatcherSendMessageOptions,
  isMessageReceivedFromDispatcher,
  MessageSentToDispatcher,
} from "./dispatcher-message";
export type AutofillEngineDispatcherCallbackType = (
  options: DispatcherCallbackOptions,
  ...args: any[]
) => unknown;
export interface AutofillEngineDispatcher {
  addListener: (
    message: string,
    callback: AutofillEngineDispatcherCallbackType
  ) => void;
  removeListener: (message: string) => void;
  sendMessage: (
    options: DispatcherSendMessageOptions,
    ...args: any[]
  ) => Promise<unknown>;
}
export const connectToDispatcher = (
  browserApi: BrowserApi,
  clientType: AutofillEngineClientType
): AutofillEngineDispatcher => {
  const dispatcherListeners: {
    [message: string]: AutofillEngineDispatcherCallbackType;
  } = {};
  const usePortConnection =
    clientType === AutofillEngineClientType.Webcards ||
    clientType === AutofillEngineClientType.Popup;
  const portName = `${DISPATCHER_MESSAGE_IDENTIFIER}-${clientType}`;
  const transport = usePortConnection
    ? connectPortTransport(browserApi, portName)
    : connectRuntimeSendmessageTransport(browserApi);
  transport.setListener((received, sendResponse) => {
    if (
      isMessageReceivedFromDispatcher(received) &&
      dispatcherListeners[received.options.message]
    ) {
      sendResponse(
        dispatcherListeners[received.options.message](
          received.options,
          ...received.parameters
        )
      );
    }
    return false;
  });
  return {
    addListener: (
      message: string,
      callback: AutofillEngineDispatcherCallbackType
    ) => {
      if (!dispatcherListeners[message]) {
        dispatcherListeners[message] = callback;
      } else {
        throw new Error(
          `Error: callback already registered for message: '${message}'`
        );
      }
    },
    removeListener(message: string) {
      if (dispatcherListeners[message]) {
        delete dispatcherListeners[message];
      } else {
        throw new Error(
          `Error: callback already removed for message: '${message}'`
        );
      }
    },
    sendMessage: (options, ...args: any[]) => {
      const messageToSend: MessageSentToDispatcher = {
        options,
        identifier: DISPATCHER_MESSAGE_IDENTIFIER,
        parameters: args,
      };
      return new Promise((resolve) => {
        transport.sendMessage(messageToSend, resolve);
      });
    },
  };
};
