import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  exhaustMap,
  filter,
  from,
  lastValueFrom,
  mergeMap,
  Observable,
  share,
  shareReplay,
  Subject,
  take,
  takeWhile,
  timeout,
} from "rxjs";
import { v4 as uuid } from "uuid";
import { Channel, ChannelState } from "./channel";
export interface UnreliableMessageSent {
  type: "send";
  id: string;
  message: unknown;
}
export interface UnreliableMessageAcknowledgement {
  type: "acknowledgement";
  id: string;
}
export type UnreliableMessage =
  | UnreliableMessageSent
  | UnreliableMessageAcknowledgement;
export interface LowLevelChannel {
  sendMessage: (message: UnreliableMessage) => Promise<void>;
  messages$: Observable<UnreliableMessage>;
  status$: Observable<ChannelState>;
  stop: () => Promise<void>;
}
interface QueuedItem {
  message: unknown;
  resolve: () => void;
  reject: (error: unknown) => void;
}
const DEFAULT_TIMEOUT = 30000;
export class AcknowledgedChannel implements Channel {
  constructor(
    unreliable: LowLevelChannel,
    timeoutValue: number = DEFAULT_TIMEOUT
  ) {
    const timeToRetrySending$ = unreliable.status$.pipe(distinctUntilChanged());
    let channelIsStopped = false;
    const itemsToSend = new Subject<QueuedItem>();
    const sendItem = async (item: QueuedItem) => {
      const id = uuid();
      let stop = false;
      const receivedAcknowledges = unreliable.messages$.pipe(
        takeWhile(() => !channelIsStopped),
        filter((x) => x.type === "acknowledgement" && x.id === id),
        take(1),
        timeout(timeoutValue),
        catchError(() => EMPTY),
        shareReplay(1)
      );
      const whenToStop = receivedAcknowledges.subscribe(() => {
        stop = true;
        whenToStop.unsubscribe();
      });
      const sendingRetries = timeToRetrySending$
        .pipe(
          takeWhile(() => !stop && !channelIsStopped),
          exhaustMap(() =>
            from(
              unreliable.sendMessage({
                type: "send",
                id,
                message: item.message,
              })
            )
          )
        )
        .subscribe();
      try {
        await lastValueFrom(receivedAcknowledges);
        sendingRetries.unsubscribe();
        item.resolve();
      } catch (error) {
        sendingRetries.unsubscribe();
        item.reject(error);
      }
    };
    const sendingLoop = itemsToSend.pipe(mergeMap(sendItem)).subscribe();
    const sendAcknowledge = async (x: UnreliableMessage): Promise<unknown> => {
      if (x.type !== "send") {
        return;
      }
      await unreliable.sendMessage({
        type: "acknowledgement",
        id: x.id,
      });
      return x.message;
    };
    this.stop = () => {
      channelIsStopped = true;
      sendingLoop.unsubscribe();
      return unreliable.stop();
    };
    this.send = (message) => {
      return new Promise((resolve, reject) => {
        const item: QueuedItem = {
          message,
          resolve,
          reject,
        };
        itemsToSend.next(item);
      });
    };
    this.channelState$ = unreliable.status$;
    this.receivedMessages$ = unreliable.messages$.pipe(
      filter((x) => x.type === "send"),
      mergeMap(sendAcknowledge),
      share()
    );
  }
  send: <TMessage>(message: TMessage) => Promise<void>;
  receivedMessages$: Observable<unknown>;
  channelState$: Observable<ChannelState>;
  stop: () => void;
}
