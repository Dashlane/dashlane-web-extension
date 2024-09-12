import { UnreliableMessage } from "./acknowledge-channel";
export interface SendMessageRequest {
  type: "graphene-message";
  channelName: string;
  message: UnreliableMessage;
}
export const sendMessageRequest = ({
  channelName,
  message,
}: {
  channelName: string;
  message: UnreliableMessage;
}): SendMessageRequest => ({
  channelName,
  message,
  type: "graphene-message",
});
export const isSendMessageRequest = (x: unknown): x is SendMessageRequest => {
  if (!x || typeof x !== "object") {
    return false;
  }
  const partial = x as Partial<SendMessageRequest>;
  return partial.type === "graphene-message";
};
