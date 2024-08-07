import { DispatcherMessages } from "./messages";
export const DISPATCHER_MESSAGE_IDENTIFIER = "autofill-engine-dispatcher";
interface DispatcherInternalMessage {
  identifier: typeof DISPATCHER_MESSAGE_IDENTIFIER;
  parameters: any[];
}
interface DispatcherMessage {
  message: DispatcherMessages;
}
export interface DispatcherSendMessageOptions extends DispatcherMessage {
  targetFrameId?: number;
}
export interface DispatcherCallbackOptions extends DispatcherMessage {
  sourceFrameId: number;
}
export interface MessageSentToDispatcher extends DispatcherInternalMessage {
  options: DispatcherSendMessageOptions;
}
export interface MessageReceivedFromDispatcher
  extends DispatcherInternalMessage {
  options: DispatcherCallbackOptions;
}
export const isMessageSentToDispatcher = (
  obj: unknown
): obj is MessageSentToDispatcher => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "identifier" in obj &&
    "options" in obj &&
    typeof obj.options === "object" &&
    obj.options !== null &&
    "message" in obj.options &&
    typeof obj.options.message === "string" &&
    obj.options.message in DispatcherMessages &&
    obj.identifier === DISPATCHER_MESSAGE_IDENTIFIER
  );
};
export const isMessageReceivedFromDispatcher = (
  obj: unknown
): obj is MessageReceivedFromDispatcher => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "identifier" in obj &&
    "options" in obj &&
    typeof obj.options === "object" &&
    obj.options !== null &&
    "sourceFrameId" in obj.options &&
    typeof obj.options.sourceFrameId === "number" &&
    "message" in obj.options &&
    typeof obj.options.message === "string" &&
    obj.options.message in DispatcherMessages &&
    obj.identifier === DISPATCHER_MESSAGE_IDENTIFIER
  );
};
