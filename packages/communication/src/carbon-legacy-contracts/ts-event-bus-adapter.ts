import { EventDeclaration, Slot } from "ts-event-bus";
import {
  defineCarbonCommand,
  DefinedCommand,
  DefinedQuery,
  defineQuery,
  UseCaseScope,
} from "@dashlane/framework-contracts";
type SlotRequestData<TSlot> = TSlot extends Slot<infer TRequestData, any>
  ? TRequestData
  : never;
type SlotResponseData<TSlot> = TSlot extends Slot<any, infer TResponseData>
  ? TResponseData
  : never;
type LiveSlotRequestData = string | undefined;
type LiveSlotResponseData<TSlot> = TSlot extends Slot<
  infer TResponseData,
  unknown
>
  ? TResponseData
  : never;
export type CommandsContractFromConnector<
  TCommandsConnectorDeclaration extends EventDeclaration
> = {
  [CommandName in keyof TCommandsConnectorDeclaration as `${Capitalize<
    string & CommandName
  >}Command`]: DefinedCommand<
    SlotRequestData<TCommandsConnectorDeclaration[CommandName]>,
    SlotResponseData<TCommandsConnectorDeclaration[CommandName]>,
    never
  >;
};
export type QueriesContractFromConnectors<
  TQueriesConnectorDeclaration extends EventDeclaration,
  TLiveQueriesConnectorDeclaration extends EventDeclaration
> = {
  [QueryName in string & keyof TQueriesConnectorDeclaration as `${Capitalize<
    string & QueryName
  >}Query`]: DefinedQuery<
    SlotResponseData<TQueriesConnectorDeclaration[QueryName]>,
    never,
    SlotRequestData<TQueriesConnectorDeclaration[QueryName]>
  >;
} & {
  [QueryName in string &
    keyof TLiveQueriesConnectorDeclaration as `${Capitalize<
    string & QueryName
  >}Query`]: DefinedQuery<
    LiveSlotResponseData<TLiveQueriesConnectorDeclaration[QueryName]>,
    never,
    LiveSlotRequestData
  >;
};
export function createCommandContractsFromConnector<
  TCommandsConnectorDeclaration extends EventDeclaration
>(commandsConnector: TCommandsConnectorDeclaration) {
  return Object.keys(commandsConnector).reduce(
    (contract, commandName) => ({
      ...contract,
      [`${commandName[0]
        .toUpperCase()
        .concat(commandName.substring(1))}Command`]: defineCarbonCommand({
        scope: UseCaseScope.Device,
      }),
    }),
    {} as CommandsContractFromConnector<TCommandsConnectorDeclaration>
  );
}
export function createQueryContractsFromConnectors<
  TQueriesConnectorDeclaration extends EventDeclaration,
  TLiveQueriesConnectorDeclaration extends EventDeclaration
>(
  queriesConnector: TQueriesConnectorDeclaration,
  liveQueriesConnector: TLiveQueriesConnectorDeclaration
) {
  const queryNames = Object.keys(queriesConnector);
  const liveQueryNames = Object.keys(liveQueriesConnector);
  return [...queryNames, ...liveQueryNames].reduce(
    (contract, queryName) => ({
      ...contract,
      [`${queryName[0].toUpperCase().concat(queryName.substring(1))}Query`]:
        defineQuery({
          scope: UseCaseScope.Device,
        }),
    }),
    {} as QueriesContractFromConnectors<
      TQueriesConnectorDeclaration,
      TLiveQueriesConnectorDeclaration
    >
  );
}
