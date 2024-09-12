import {
  catchError,
  endWith,
  filter,
  from,
  map,
  mergeMap,
  Observable,
  of,
} from "rxjs";
import { Channel } from "../channel";
import { DeliveryMetadata } from "../message-broker";
import {
  ConversationEndMessage,
  ConversationStartAckMessage,
  ConversationStartMessage,
  DataReplyMessage,
  ErrorMessage,
  isConversationStartMessage,
  isUnSubscriptionMessage,
  Message,
  UnSubscriptionMessage,
} from "./messages.types";
interface UnuSubscribable {
  unsubscribe: () => void;
}
export const listenToChannel = (
  onIncomingMessage: <TMessage>(
    mailbox: string,
    message: TMessage,
    metadata: DeliveryMetadata
  ) => Observable<unknown>,
  channel: Channel,
  mailboxes: string[]
): {
  unsubscribe: () => void;
} => {
  const mailboxesSet = new Set(mailboxes);
  const activeCalls = new Map<string, UnuSubscribable>();
  const cancelSub = channel.receivedMessages$
    .pipe(filter(isUnSubscriptionMessage))
    .subscribe((message: UnSubscriptionMessage) => {
      const subscription = activeCalls.get(message.id);
      subscription?.unsubscribe();
      activeCalls.delete(message.id);
    });
  const isNewConversationMessage = (
    message: unknown
  ): message is ConversationStartMessage => {
    return (
      isConversationStartMessage(message) &&
      mailboxesSet.has(message.definition.destination) &&
      !activeCalls.has(message.definition.id)
    );
  };
  const sendAcknowledgments = async (message: ConversationStartMessage) => {
    activeCalls.set(message.definition.id, {
      unsubscribe: () => {
        return;
      },
    });
    await channel.send<ConversationStartAckMessage>({
      type: "initial-acknowledgement",
      id: message.definition.id,
    });
    return message;
  };
  const incomingMessages$ = channel.receivedMessages$.pipe(
    filter(isNewConversationMessage),
    mergeMap((m) => from(sendAcknowledgments(m)))
  );
  const incomingsSubscription = incomingMessages$.subscribe((message) => {
    const mailbox = message.definition.destination;
    const callResult = onIncomingMessage(
      mailbox,
      message.definition.content,
      message.metadata
    );
    const endMessage: ConversationEndMessage = {
      type: "end",
      id: message.definition.id,
    };
    const sendMessageSubscription = callResult
      .pipe(
        map((result) => {
          const data: DataReplyMessage = {
            id: message.definition.id,
            data: result,
            type: "data",
          };
          return data;
        }),
        catchError((error) => {
          const errMsg: ErrorMessage = {
            id: message.definition.id,
            type: "error",
            errorMessage: error.message,
          };
          return of(errMsg);
        }),
        endWith(endMessage),
        mergeMap((data) => from(channel.send<Message>(data)))
      )
      .subscribe();
    activeCalls.set(message.definition.id, {
      unsubscribe: () => {
        sendMessageSubscription.unsubscribe();
      },
    });
  });
  return {
    unsubscribe: () => {
      incomingsSubscription.unsubscribe();
      cancelSub.unsubscribe();
      for (const unSubscription of activeCalls.values()) {
        unSubscription.unsubscribe();
      }
    },
  };
};
