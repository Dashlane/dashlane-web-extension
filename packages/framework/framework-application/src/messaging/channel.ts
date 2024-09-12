import { BehaviorSubject, Observable, Subject } from "rxjs";
export enum ChannelState {
  Connected = "Connected",
  Disconnected = "Disconnected",
}
export interface Channel {
  readonly send: <TMessage>(message: TMessage) => Promise<void>;
  readonly receivedMessages$: Observable<unknown>;
  readonly channelState$: Observable<ChannelState>;
  readonly stop: () => void;
}
export interface MemoryChannelConnection {
  disconnect: () => void;
}
export class MemoryChannel implements Channel {
  public send<TMessage>(message: TMessage): Promise<void> {
    if (this.channelStateSubject$.value !== ChannelState.Connected) {
      throw new Error("Channel is not connected");
    }
    this.sentMessages$.next(message);
    return Promise.resolve();
  }
  public get receivedMessages$() {
    return this.receivedMessagesSubject$;
  }
  public get channelState$() {
    return this.channelStateSubject$;
  }
  public stop() {
    this.receivedMessages$.complete();
  }
  public connect(receivingEnd: MemoryChannel): MemoryChannelConnection {
    if (this.channelStateSubject$.value === ChannelState.Connected) {
      return {
        disconnect: () => {},
      };
    }
    const subscription = this.sentMessages$.subscribe((message: unknown) => {
      receivingEnd.receivedMessages$.next(message);
    });
    this.channelState$.next(ChannelState.Connected);
    return {
      disconnect: () => {
        this.channelState$.next(ChannelState.Disconnected);
        subscription.unsubscribe();
      },
    };
  }
  private sentMessages$ = new Subject<unknown>();
  private receivedMessagesSubject$ = new Subject<unknown>();
  private channelStateSubject$ = new BehaviorSubject<ChannelState>(
    ChannelState.Disconnected
  );
}
