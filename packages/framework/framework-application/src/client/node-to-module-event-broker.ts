import { EventMetadata, NodeEventBroker } from "./node-event-broker";
import { Startable } from "../messaging/startable";
import {
  AnyAppDefinition,
  ApisNamesOf,
  BodyOfEvent,
  NodeIdentifiersOf,
} from "@dashlane/framework-contracts";
import { safeCast } from "@dashlane/framework-types";
import { NodeConfiguration } from "../messaging/node-configuration";
import { RequestContext } from "../request-context/request-context";
export interface EventsCallback<TAppDefinition extends AnyAppDefinition> {
  onEvent: (
    emitter: ApisNamesOf<TAppDefinition>,
    targetModule: ApisNamesOf<TAppDefinition>,
    eventName: string,
    event: unknown,
    context: RequestContext,
    metaData: EventMetadata
  ) => Promise<void>;
}
export class NodeToModuleEventBroker<
  TAppDefinition extends AnyAppDefinition = AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> = NodeIdentifiersOf<TAppDefinition>
> {
  private readonly broker: NodeEventBroker<TAppDefinition, TCurrentNode>;
  private localSubscribersMap: Record<
    string,
    Record<string, ApisNamesOf<TAppDefinition>[]>
  >;
  constructor(configuration: NodeConfiguration<TAppDefinition, TCurrentNode>) {
    this.broker = new NodeEventBroker(configuration);
    const initial = configuration.getModuleNames().reduce(
      (result, nodeName) => ({
        ...result,
        [nodeName]: Object.keys(
          configuration.appDefinition[nodeName].api.events
        ).reduce((eventList, eventName) => {
          eventList[eventName] = [];
          return eventList;
        }, safeCast<Record<string, ApisNamesOf<TAppDefinition>[]>>({})),
      }),
      safeCast<Record<string, Record<string, ApisNamesOf<TAppDefinition>[]>>>(
        {}
      )
    );
    this.localSubscribersMap = Object.keys(configuration.subscriptions)
      .map((subscriber) => subscriber as ApisNamesOf<TAppDefinition>)
      .reduce((result, subscriber) => {
        const subscriptions = configuration.subscriptions[
          subscriber
        ] as Partial<Record<string, string[]>>;
        Object.keys(subscriptions)
          .map((key) => key as ApisNamesOf<TAppDefinition>)
          .forEach((subscribedTo) => {
            const events = subscriptions[subscribedTo] ?? [];
            const secondMap = result[subscribedTo];
            events.forEach((event) => {
              secondMap[event].push(subscriber as ApisNamesOf<TAppDefinition>);
            });
          });
        return result;
      }, initial);
  }
  publishEvent = <
    TModuleName extends ApisNamesOf<TAppDefinition>,
    TEventName extends keyof TAppDefinition[TModuleName]["api"]["events"]
  >(
    emitter: TModuleName,
    eventName: TEventName,
    event: BodyOfEvent<
      TAppDefinition[TModuleName]["api"]["events"][TEventName]
    >,
    context: RequestContext
  ): Promise<void> => {
    return this.broker.publishEvent(emitter, eventName, event, context);
  };
  public connect(callbacks: EventsCallback<TAppDefinition>): Startable {
    const { localSubscribersMap: reverseMap, broker } = this;
    return broker.connect({
      onLocalEvent: async (
        emitter,
        _targetNode,
        eventName,
        event,
        context,
        metaData
      ) => {
        const subscribers = reverseMap[emitter][eventName];
        await Promise.all(
          subscribers.map(async (targetModule) => {
            await callbacks.onEvent(
              emitter,
              targetModule,
              eventName,
              event,
              context,
              metaData
            );
          })
        );
      },
    });
  }
}
