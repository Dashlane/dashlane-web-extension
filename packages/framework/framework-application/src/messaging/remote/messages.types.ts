import { DeliveryMetadata } from "../message-broker";
export interface ConversationDefinition {
  destination: string;
  id: string;
  content: unknown;
}
export interface ConversationStartMessage {
  type: "start";
  definition: ConversationDefinition;
  metadata: DeliveryMetadata;
}
export interface ConversationStartAckMessage {
  type: "initial-acknowledgement";
  id: string;
}
export interface DataReplyMessage {
  type: "data";
  id: string;
  data: unknown;
}
export interface ErrorMessage {
  type: "error";
  errorMessage: string;
  id: string;
}
export interface ConversationEndMessage {
  type: "end";
  id: string;
}
export interface UnSubscriptionMessage {
  type: "unSubscription";
  id: string;
}
export type Message =
  | ConversationStartMessage
  | ConversationStartAckMessage
  | ConversationEndMessage
  | UnSubscriptionMessage
  | DataReplyMessage
  | ErrorMessage;
export const isErrorMessage = (x: unknown): x is ErrorMessage => {
  if (!x || typeof x !== "object") {
    return false;
  }
  return (x as Partial<ErrorMessage>).type === "error";
};
export const isConversationStartAckMessage = (
  x: unknown
): x is ConversationStartAckMessage => {
  if (!x || typeof x !== "object") {
    return false;
  }
  const partial = x as Partial<ConversationStartAckMessage>;
  return partial.type === "initial-acknowledgement";
};
export const isConversationStartMessage = (
  x: unknown
): x is ConversationStartMessage => {
  if (!x || typeof x !== "object") {
    return false;
  }
  const partial = x as Partial<ConversationStartMessage>;
  return partial.type === "start";
};
export const isDataReplyMessage = (x: unknown): x is DataReplyMessage => {
  if (!x || typeof x !== "object") {
    return false;
  }
  const partial = x as Partial<DataReplyMessage>;
  return partial.type === "data";
};
export const isDataEndMessage = (x: unknown): x is ConversationEndMessage => {
  if (!x || typeof x !== "object") {
    return false;
  }
  const partial = x as Partial<ConversationEndMessage>;
  return partial.type === "end";
};
export const isUnSubscriptionMessage = (
  x: unknown
): x is UnSubscriptionMessage => {
  if (!x || typeof x !== "object") {
    return false;
  }
  const partial = x as Partial<UnSubscriptionMessage>;
  return partial.type === "unSubscription";
};
