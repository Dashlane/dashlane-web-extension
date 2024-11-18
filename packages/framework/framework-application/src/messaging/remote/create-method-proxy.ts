import {
  combineLatest,
  distinctUntilChanged,
  exhaustMap,
  filter,
  firstValueFrom,
  from,
  lastValueFrom,
  map,
  Observable,
  takeWhile,
} from "rxjs";
import { Channel, ChannelState } from "../channel";
import { v4 as uuid } from "uuid";
import {
  ConversationDefinition,
  ConversationStartMessage,
  isConversationStartAckMessage,
  isDataEndMessage,
  isDataReplyMessage,
  isErrorMessage,
  UnSubscriptionMessage,
} from "./messages.types";
import { DeliveryMetadata, MessageRoute } from "../message-broker";
export const createMethodProxy = (
  channel: Channel,
  stopped$: Observable<boolean>
): MessageRoute => {
  const send = <T>(
    destMailbox: string,
    messageToSend: T,
    metadata: DeliveryMetadata
  ) => {
    const definition: ConversationDefinition = {
      content: messageToSend,
      destination: String(destMailbox),
      id: uuid(),
    };
    return new Observable((subscriber) => {
      let start: ConversationStartMessage = {
        type: "start",
        definition,
        metadata,
      };
      const receivedMessagesSubscription = combineLatest({
        message: channel.receivedMessages$,
        stopped: stopped$,
      })
        .pipe(
          takeWhile(({ stopped }) => !stopped),
          map(({ message }) => message)
        )
        .subscribe((message) => {
          if (
            isConversationStartAckMessage(message) &&
            message.id === definition.id
          ) {
            start = {
              ...start,
              metadata: { ...start.metadata, isReminder: true },
            };
            return;
          }
          if (isDataReplyMessage(message) && message.id === definition.id) {
            subscriber.next(message.data);
            return;
          }
          if (isErrorMessage(message) && message.id === definition.id) {
            subscriber.error(new Error(message.errorMessage));
            return;
          }
          if (isDataEndMessage(message) && message.id === definition.id) {
            subscriber.complete();
            return;
          }
        });
      const sendMessageSubscription = combineLatest({
        sendTimes: channel.channelState$.pipe(
          distinctUntilChanged(),
          filter((c) => c === ChannelState.Connected)
        ),
        stopped: stopped$,
      })
        .pipe(
          takeWhile(({ stopped }) => !stopped),
          exhaustMap(() => from(channel.send(start)))
        )
        .subscribe();
      return () => {
        channel.send<UnSubscriptionMessage>({
          type: "unSubscription",
          id: definition.id,
        });
        sendMessageSubscription.unsubscribe();
        receivedMessagesSubscription.unsubscribe();
      };
    });
  };
  const trySend = async <T>(
    destMailbox: string,
    messageToSend: T,
    metadata: DeliveryMetadata
  ): Promise<boolean> => {
    const state = await firstValueFrom(channel.channelState$);
    if (state !== ChannelState.Connected) {
      return false;
    }
    await lastValueFrom(send(destMailbox, messageToSend, metadata));
    return true;
  };
  return {
    send,
    trySend,
  };
};
