import {
  BehaviorSubject,
  lastValueFrom,
  Observable,
  Unsubscribable,
} from "rxjs";
import {
  MessageBroker,
  MessageBrokerMailboxesDefinition,
  MessageRoute,
} from "./message-broker";
import { listenToChannel } from "./remote/listen-to-channel";
import { createMethodProxy } from "./remote/create-method-proxy";
import { Channel } from "./channel";
import { Startable } from "./startable";
import { safeCast } from "@dashlane/framework-types";
import { ChannelsListener } from "./channels-listener";
declare global {
  function structuredClone(value: unknown): unknown;
}
export class ChannelMessageBroker<TMessage> implements MessageBroker<TMessage> {
  private readonly routes: Record<string, MessageRoute>;
  private readonly stopped$ = new BehaviorSubject(false);
  constructor(mailboxes: MessageBrokerMailboxesDefinition) {
    const emptyState = {
      routes: safeCast<Record<string, MessageRoute>>({}),
    };
    const createMailboxToMethodMap = () => {
      const { routes } = Object.keys(mailboxes).reduce((acc, mailbox) => {
        const definition = mailboxes[mailbox];
        if (definition.type === "local") {
          acc.routes[mailbox] = {
            send: definition.onMessage,
            trySend: async (...args) => {
              await lastValueFrom(definition.onMessage(...args));
              return true;
            },
          };
        }
        if (definition.type === "remote") {
          const route = createMethodProxy(definition.channel, this.stopped$);
          acc.routes[mailbox] = route;
        }
        return acc;
      }, emptyState);
      return routes;
    };
    this.routes = createMailboxToMethodMap();
  }
  public connect(channels: Channel[], listener: ChannelsListener): Startable {
    let started = false;
    return {
      start: () => {
        if (started) {
          throw new Error("Already started");
        }
        started = true;
        const subscribeToChannel = (channel: Channel) =>
          listenToChannel(
            (mailbox, message, metadata) => {
              return this.routes[mailbox].send(mailbox, message, metadata);
            },
            channel,
            Object.keys(this.routes)
          );
        const staticUnsubscribes = channels.map(subscribeToChannel);
        const connectedListenedChannels = new Map<string, Unsubscribable>();
        const listenerSubscription = listener.connectedChannels$.subscribe(
          (listenerChannels) => {
            const toUnsubscribe = [
              ...connectedListenedChannels.entries(),
            ].filter(([key]) => !(key in listenerChannels));
            const toSubscribe = Object.keys(listenerChannels).filter(
              (key) => !connectedListenedChannels.has(key)
            );
            toUnsubscribe.forEach(([key, value]) => {
              connectedListenedChannels.delete(key);
              value.unsubscribe();
            });
            toSubscribe.forEach((key) => {
              const channel = listenerChannels[key];
              const channelSubscription = subscribeToChannel(channel);
              connectedListenedChannels.set(key, channelSubscription);
            });
          }
        );
        return Promise.resolve({
          stop: () => {
            [
              ...staticUnsubscribes,
              listenerSubscription,
              ...connectedListenedChannels.values(),
            ].forEach((x) => x.unsubscribe());
            this.stopped$.next(true);
            return Promise.resolve();
          },
        });
      },
    };
  }
  private ensureMessageSerializable(mailbox: string, message: TMessage) {}
  public sendMessage(mailbox: string, message: TMessage): Observable<TMessage> {
    this.ensureMessageSerializable(mailbox, message);
    return this.routes[mailbox].send(mailbox, message, {
      isReminder: false,
    }) as Observable<TMessage>;
  }
  public trySendMessage(mailbox: string, message: TMessage): Promise<boolean> {
    this.ensureMessageSerializable(mailbox, message);
    return this.routes[mailbox].trySend(mailbox, message, {
      isReminder: false,
    });
  }
}
