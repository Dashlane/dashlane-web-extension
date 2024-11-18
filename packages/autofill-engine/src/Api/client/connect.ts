import { isSerializedAutofillEngineAction } from "../../implementation/abstractions/messaging/action-serializer";
import { makeAutofillEngineCommandSerializer } from "../../implementation/abstractions/messaging/command-serializer";
import { AutofillEngineActions } from "../types/actions";
import { BrowserApi } from "../types/browser/browser-api";
import { AutofillEngineClientType } from "../types/client-type";
import { AutofillEngineCommands } from "../types/commands";
import { AutofillEngineMessageLogger } from "../types/logger";
export const connectToAutofillEngine = (
  browserApi: BrowserApi,
  actionsHandler: Partial<AutofillEngineActions>,
  clientType: AutofillEngineClientType,
  messageLogger?: AutofillEngineMessageLogger
): AutofillEngineCommands => {
  let port: chrome.runtime.Port | undefined;
  const usePostMessage = clientType === AutofillEngineClientType.Webcards;
  const autofillEngineCommands = makeAutofillEngineCommandSerializer(
    (command) => {
      if (!__REDACTED__) {
        messageLogger?.(`Client '${clientType}' sending command`, {
          content: command,
        });
      }
      if (usePostMessage) {
        port?.postMessage(command);
      } else {
        browserApi.runtime.sendMessage(command);
      }
    }
  );
  const onMessageListener = (
    message: unknown,
    sendResponse?: (response?: unknown) => void
  ) => {
    if (
      isSerializedAutofillEngineAction(message) &&
      actionsHandler[message.action]
    ) {
      if (!__REDACTED__) {
        messageLogger?.(`Client '${clientType}' received action`, {
          timestamp: Date.now(),
          content: message,
        });
      }
      try {
        const handler = actionsHandler[message.action] as (
          ...args: any
        ) => void;
        handler(...message.parameters);
      } catch (exception) {
        const exceptionMessage =
          exception instanceof Error ? exception.message : String(exception);
        const stack = exception instanceof Error ? exception.stack : undefined;
        const logMessage = [
          `Exception processing action ${message.action}`,
          exceptionMessage,
        ].join(" - ");
        autofillEngineCommands.logException(clientType, {
          message: logMessage,
          precisions: stack,
        });
      }
      sendResponse?.();
    }
    return false;
  };
  const connectOnMessageListener = (message: unknown) =>
    onMessageListener(message);
  const runtimeOnMessageListener = (
    message: unknown,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => onMessageListener(message, sendResponse);
  const onDisconnectListener = () => {
    if (port) {
      port.onMessage.removeListener(connectOnMessageListener);
      port.onDisconnect.removeListener(onDisconnectListener);
      port = undefined;
    }
    connect();
  };
  const connect = () => {
    if (!port) {
      port = browserApi.runtime.connect();
      port.onMessage.addListener(connectOnMessageListener);
      port.onDisconnect.addListener(onDisconnectListener);
    }
  };
  if (usePostMessage) {
    port?.disconnect();
    onDisconnectListener();
  } else {
    browserApi.runtime.onMessage.addListener(runtimeOnMessageListener);
  }
  return autofillEngineCommands;
};
