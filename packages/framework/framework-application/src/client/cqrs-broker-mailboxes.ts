import {
  AnyAppDefinition,
  ApisNamesOf,
  NodeIdentifiersOf,
} from "@dashlane/framework-contracts";
import { Result, safeCast } from "@dashlane/framework-types";
import { Observable } from "rxjs";
import {
  Channel,
  DeliveryMetadata,
  MailboxDefinition,
  MessageBrokerMailboxesDefinition,
} from "../messaging";
interface CommandRequest<TModuleName> {
  type: "command";
  module: TModuleName;
  commandName: string;
  command: unknown;
  context: Record<string, unknown>;
}
interface QueryRequest<TModuleName> {
  type: "query";
  module: TModuleName;
  queryName: string;
  query: unknown;
  context: Record<string, unknown>;
}
export interface Response {
  type: "response";
  response: Result<unknown, unknown>;
}
export const isResponse = (x: MessageType<string>): x is Response => {
  return x.type === "response";
};
export type MessageType<TModuleName> =
  | CommandRequest<TModuleName>
  | QueryRequest<TModuleName>
  | Response;
export const createMailboxForCqrs = <
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
>(
  appDefinition: TAppDefinition,
  currentNode: NodeIdentifiersOf<TAppDefinition> | null,
  channels: Record<
    Exclude<NodeIdentifiersOf<TAppDefinition>, TCurrentNode>,
    Channel
  >,
  onLocalMessage: (
    mailbox: string,
    param: MessageType<ApisNamesOf<TAppDefinition>>,
    metadata: DeliveryMetadata
  ) => Observable<Response>
): MessageBrokerMailboxesDefinition => {
  const createMailboxes = (
    moduleName: string
  ): {
    commandMailbox: MailboxDefinition;
    queryMailbox: MailboxDefinition;
  } => {
    const { main, queryOnly } = appDefinition[moduleName];
    const localMailbox: MailboxDefinition = {
      type: "local",
      onMessage: onLocalMessage,
    };
    if (main === currentNode) {
      return {
        commandMailbox: localMailbox,
        queryMailbox: localMailbox,
      };
    }
    const channel =
      channels[
        main as Exclude<NodeIdentifiersOf<TAppDefinition>, TCurrentNode>
      ];
    const remoteMailbox: MailboxDefinition = {
      type: "remote",
      channel,
    };
    return {
      commandMailbox: remoteMailbox,
      queryMailbox:
        currentNode && queryOnly.includes(currentNode)
          ? localMailbox
          : remoteMailbox,
    };
  };
  const reducer = (
    mailboxes: MessageBrokerMailboxesDefinition,
    moduleName: string
  ): MessageBrokerMailboxesDefinition => {
    const { commandMailbox, queryMailbox } = createMailboxes(moduleName);
    mailboxes[`command-${moduleName}`] = commandMailbox;
    mailboxes[`query-${moduleName}`] = queryMailbox;
    return mailboxes;
  };
  const result = Object.keys(appDefinition).reduce(
    reducer,
    safeCast<MessageBrokerMailboxesDefinition>({})
  );
  return result;
};
