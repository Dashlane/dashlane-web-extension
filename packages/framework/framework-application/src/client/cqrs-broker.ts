import { EMPTY, filter, firstValueFrom, from, map, Observable } from "rxjs";
import { assertUnreachable, Result } from "@dashlane/framework-types";
import {
  AnyAppDefinition,
  ApisNamesOf,
  BodyOfCommand,
  BodyOfQuery,
  NodeIdentifiersOf,
  ResultOf,
} from "@dashlane/framework-contracts";
import {
  createMailboxForCqrs,
  isResponse,
  MessageType,
  Response,
} from "./cqrs-broker-mailboxes";
import { DeliveryMetadata, MessageBroker } from "../messaging/message-broker";
import { NodeConfiguration } from "../messaging/node-configuration";
import { Startable } from "../messaging/startable";
import { ChannelMessageBroker } from "../messaging/channel-message-broker";
import { RequestContext } from "../request-context/request-context";
const NoCallbacks = (): Observable<never> => {
  return from([]);
};
export interface CqrsCallbacks<TAppDefinition extends AnyAppDefinition> {
  onCommand: (
    moduleName: ApisNamesOf<TAppDefinition>,
    commandName: string,
    command: unknown,
    context: RequestContext,
    metadata: CommandMetadata
  ) => Promise<Result<unknown, unknown>>;
  onQuery: (
    moduleName: ApisNamesOf<TAppDefinition>,
    commandName: string,
    query: unknown,
    context: RequestContext
  ) => Observable<Result<unknown, unknown>>;
}
export interface CommandMetadata {
  isReminder: boolean;
}
export class CqrsBroker<
  TAppDefinition extends AnyAppDefinition = AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> | null = null
> {
  private broker?: MessageBroker<MessageType<ApisNamesOf<TAppDefinition>>>;
  private config: NodeConfiguration<TAppDefinition, TCurrentNode>;
  constructor(config: NodeConfiguration<TAppDefinition, TCurrentNode>) {
    this.config = config;
  }
  async sendCommand<
    TModuleName extends ApisNamesOf<TAppDefinition>,
    TCommandName extends keyof TAppDefinition[TModuleName]["api"]["commands"]
  >(
    moduleName: TModuleName,
    commandName: TCommandName,
    param: BodyOfCommand<
      TAppDefinition[TModuleName]["api"]["commands"][TCommandName]
    >,
    context: RequestContext
  ): Promise<
    ResultOf<TAppDefinition[TModuleName]["api"]["commands"][TCommandName]>
  > {
    if (!this.broker) {
      throw new Error("call connect() first");
    }
    const result = await firstValueFrom(
      this.broker
        .sendMessage(`command-${moduleName}`, {
          type: "command",
          module: moduleName,
          commandName: String(commandName),
          command: param,
          context: context.toSerializable(),
        })
        .pipe(
          filter(isResponse),
          map(
            (x) =>
              x.response as ResultOf<
                TAppDefinition[TModuleName]["api"]["commands"][TCommandName]
              >
          )
        )
    );
    return result;
  }
  sendQuery<
    TModuleName extends ApisNamesOf<TAppDefinition>,
    TQueryName extends keyof TAppDefinition[TModuleName]["api"]["queries"]
  >(
    moduleName: TModuleName,
    queryName: TQueryName,
    param: BodyOfQuery<
      TAppDefinition[TModuleName]["api"]["queries"][TQueryName]
    >,
    context: RequestContext
  ): Observable<
    ResultOf<TAppDefinition[TModuleName]["api"]["queries"][TQueryName]>
  > {
    if (!this.broker) {
      throw new Error("call connect() first");
    }
    const replies$ = this.broker
      .sendMessage(`query-${moduleName}`, {
        type: "query",
        module: moduleName,
        queryName: String(queryName),
        query: param,
        context: context.toSerializable(),
      })
      .pipe(
        filter(isResponse),
        map(
          (x) =>
            x.response as ResultOf<
              TAppDefinition[TModuleName]["api"]["queries"][TQueryName]
            >
        )
      );
    return replies$;
  }
  connect(callbacks?: CqrsCallbacks<TAppDefinition>): Startable {
    type Message = MessageType<ApisNamesOf<TAppDefinition>>;
    const onLocalMessage = callbacks
      ? (
          mailbox: string,
          message: Message,
          metadata: DeliveryMetadata
        ): Observable<Response> => {
          switch (message.type) {
            case "response":
              return EMPTY;
            case "command":
              return from(
                callbacks.onCommand(
                  message.module,
                  message.commandName,
                  message.command,
                  RequestContext.fromSerializable(message.context),
                  {
                    isReminder: metadata.isReminder,
                  }
                )
              ).pipe(
                map((x) => ({
                  type: "response",
                  response: x,
                }))
              );
            case "query":
              return from(
                callbacks.onQuery(
                  message.module,
                  message.queryName,
                  message.query,
                  RequestContext.fromSerializable(message.context)
                )
              ).pipe(
                map((x) => ({
                  type: "response",
                  response: x,
                }))
              );
          }
          assertUnreachable(message);
        }
      : NoCallbacks;
    const mailboxes = createMailboxForCqrs(
      this.config.appDefinition,
      this.config.currentNode,
      this.config.channels,
      onLocalMessage
    );
    this.broker = new ChannelMessageBroker<Message>(mailboxes);
    return this.broker.connect(
      Object.values(this.config.channels),
      this.config.channelsListener
    );
  }
}
