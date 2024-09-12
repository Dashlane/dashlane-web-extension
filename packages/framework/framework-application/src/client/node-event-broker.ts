import { EMPTY, from, map, Observable, of } from "rxjs";
import { compose, concat, mergeWith, uniq } from "ramda";
import {
  ChannelMessageBroker,
  DeliveryMetadata,
  MessageBroker,
  Startable,
} from "../messaging";
import {
  ACKNOWLEDGED,
  ASK_MESSAGE,
  createMailboxesForEvents,
  EventPublicationMessage,
  EventsSubscription,
  MessageType,
} from "./node-event-broker.mailboxes";
import {
  AnyAppDefinition,
  ApisNamesOf,
  BodyOfEvent,
  NodeIdentifiersOf,
} from "@dashlane/framework-contracts";
import { safeCast } from "@dashlane/framework-types";
import { Injectable } from "../dependency-injection/injectable.decorator";
import { NodeConfiguration } from "../messaging/node-configuration";
import { RequestContext } from "../request-context/request-context";
import { LocallyImplementedApisOf } from "../application/app.types";
export interface EventMetadata {
  isReminder: boolean;
}
export interface LocalEventCallback<TAppDefinition extends AnyAppDefinition> {
  onLocalEvent: (
    emitter: ApisNamesOf<TAppDefinition>,
    targetNode: NodeIdentifiersOf<TAppDefinition>,
    eventName: string,
    event: unknown,
    context: RequestContext,
    metaData: EventMetadata
  ) => Promise<void>;
}
@Injectable()
export class NodeEventBroker<
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
> {
  private configuration: NodeConfiguration<TAppDefinition, TCurrentNode>;
  private broker?: MessageBroker<MessageType>;
  private readonly subscriberToEvent: Record<string, Record<string, string[]>>;
  private eventToSubscriber: Record<
    string,
    Map<string, NodeIdentifiersOf<TAppDefinition>[]>
  >;
  constructor(configuration: NodeConfiguration<TAppDefinition, TCurrentNode>) {
    this.configuration = configuration;
    const allSubscription = Object.entries(configuration.appDefinition).reduce(
      (result, [moduleName, moduleDef]) => {
        result[moduleName as ApisNamesOf<TAppDefinition>] = Object.keys(
          moduleDef.api.events
        );
        return result;
      },
      {} as Record<ApisNamesOf<TAppDefinition>, string[]>
    );
    this.subscriberToEvent = this.configuration
      .getNodeList()
      .reduce((result, node) => {
        result[node] = { ...allSubscription };
        return result;
      }, {} as Record<NodeIdentifiersOf<TAppDefinition>, Record<ApisNamesOf<TAppDefinition>, string[]>>);
    this.eventToSubscriber = this.regenerateReverseSubscriptionMap();
  }
  async publishEvent<
    TModuleName extends ApisNamesOf<TAppDefinition>,
    TEventName extends keyof TAppDefinition[TModuleName]["api"]["events"]
  >(
    emitter: TModuleName,
    eventName: TEventName,
    event: BodyOfEvent<
      TAppDefinition[TModuleName]["api"]["events"][TEventName]
    >,
    context: RequestContext
  ): Promise<void> {
    const { broker, eventToSubscriber: reverseSubscriptionMap } = this;
    if (!broker) {
      throw new Error("Not started");
    }
    const nodesToSendTo =
      reverseSubscriptionMap[emitter].get(eventName as string) ?? [];
    const messages = nodesToSendTo.map<EventPublicationMessage>((node) => ({
      type: "event",
      context: context.toSerializable(),
      event,
      eventName: eventName as string,
      moduleSource: emitter,
      nodeDestination: node,
    }));
    await Promise.all(
      messages.map(async (message) => {
        await broker.trySendMessage(
          `event-${message.nodeDestination}`,
          message
        );
      })
    );
  }
  connect(callbacks: LocalEventCallback<TAppDefinition>): Startable {
    const { configuration } = this;
    const subscribesTo = Object.keys(configuration.subscriptions).reduce(
      (result, subscriber) => {
        const subscriptions =
          configuration.subscriptions[
            subscriber as LocallyImplementedApisOf<TAppDefinition, TCurrentNode>
          ];
        return mergeWith(compose(uniq, concat), result, subscriptions);
      },
      safeCast<Record<string, string[]>>({})
    );
    const subscriptionMessage: EventsSubscription = {
      type: "subscriptions",
      nodeName: configuration.currentNode,
      subscribesTo,
    };
    const onLocalMessage = (
      _mailbox: string,
      param: MessageType,
      metadata: DeliveryMetadata
    ): Observable<unknown> => {
      switch (param.type) {
        case "event": {
          return from(
            callbacks.onLocalEvent(
              param.moduleSource as ApisNamesOf<TAppDefinition>,
              param.nodeDestination as NodeIdentifiersOf<TAppDefinition>,
              param.eventName,
              param.event,
              RequestContext.fromSerializable(param.context),
              metadata
            )
          ).pipe(map(() => ACKNOWLEDGED));
        }
        case "eventResponse": {
          return EMPTY;
        }
        case "subscriptions": {
          this.subscriberToEvent[param.nodeName] = param.subscribesTo;
          this.eventToSubscriber = this.regenerateReverseSubscriptionMap();
          return of(ACKNOWLEDGED);
        }
        case "ask": {
          return of(subscriptionMessage);
        }
      }
    };
    const mailboxes = createMailboxesForEvents(
      this.configuration,
      onLocalMessage
    );
    const broker: MessageBroker<MessageType> = new ChannelMessageBroker(
      mailboxes
    );
    configuration.getNodeList().map(async (node) => {
      await broker.trySendMessage(`event-${node}`, subscriptionMessage);
      await broker.trySendMessage(`event-${node}`, ASK_MESSAGE);
    });
    this.broker = broker;
    return broker.connect(
      Object.values(configuration.channels),
      configuration.channelsListener
    );
  }
  private regenerateReverseSubscriptionMap(): Record<
    string,
    Map<string, NodeIdentifiersOf<TAppDefinition>[]>
  > {
    const { configuration, subscriberToEvent: subscriptionMap } = this;
    const initial = configuration
      .getModuleNames()
      .reduce(
        (result, nodeName) => ({ ...result, [nodeName]: new Map() }),
        {} as Record<string, Map<string, NodeIdentifiersOf<TAppDefinition>[]>>
      );
    return configuration.getNodeList().reduce((result, nodeName) => {
      const subscriptionsOfNode =
        subscriptionMap[nodeName as NodeIdentifiersOf<TAppDefinition>];
      Object.entries(subscriptionsOfNode).forEach(([subscribedTo, events]) => {
        if (!(subscribedTo in result)) {
          throw new Error(
            "A module depends on events from " +
              subscribedTo +
              " but this one is not in the app def"
          );
        }
        const subscriptionsMap = result[subscribedTo];
        events.forEach((event) => {
          const subscribersArray = [
            ...(subscriptionsMap.get(event) ?? []),
            nodeName,
          ];
          subscriptionsMap.set(event, subscribersArray);
        });
      });
      return result;
    }, initial);
  }
}
