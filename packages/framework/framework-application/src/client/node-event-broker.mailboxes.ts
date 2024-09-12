import {
  AnyAppDefinition,
  NodeIdentifiersOf,
} from "@dashlane/framework-contracts";
import { safeCast } from "@dashlane/framework-types";
import { Observable } from "rxjs";
import { RemoteChannelsName } from "../application/app.types";
import {
  DeliveryMetadata,
  MessageBrokerMailboxesDefinition,
  NodeConfiguration,
} from "../messaging";
export interface EventPublicationMessage {
  type: "event";
  moduleSource: string;
  nodeDestination: string;
  eventName: string;
  event: unknown;
  context: Record<string, unknown>;
}
interface AskForSubscriptions {
  type: "ask";
}
export const ASK_MESSAGE: AskForSubscriptions = { type: "ask" };
export interface EventsSubscription {
  type: "subscriptions";
  nodeName: string;
  subscribesTo: Record<string, string[]>;
}
interface EventAcknowledgeMessage {
  type: "eventResponse";
}
export const ACKNOWLEDGED: EventAcknowledgeMessage = {
  type: "eventResponse",
};
export type MessageType =
  | EventPublicationMessage
  | EventAcknowledgeMessage
  | EventsSubscription
  | AskForSubscriptions;
export const createMailboxesForEvents = <
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
>(
  configuration: NodeConfiguration<TAppDefinition, TCurrentNode>,
  onLocalMessage: (
    mailbox: string,
    param: MessageType,
    metadata: DeliveryMetadata
  ) => Observable<unknown>
): MessageBrokerMailboxesDefinition => {
  const nodes = configuration.getNodeList();
  return nodes.reduce((mailbox, node) => {
    if (node === configuration.currentNode) {
      mailbox[`event-${node}`] = {
        type: "local",
        onMessage: onLocalMessage,
      };
    } else {
      mailbox[`event-${node}`] = {
        type: "remote",
        channel:
          configuration.channels[
            node as RemoteChannelsName<TAppDefinition, TCurrentNode>
          ],
      };
    }
    return mailbox;
  }, safeCast<MessageBrokerMailboxesDefinition>({}));
};
