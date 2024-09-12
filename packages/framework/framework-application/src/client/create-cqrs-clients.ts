import { CqrsBroker } from "./cqrs-broker";
import {
  AnyAppDefinition,
  ApisNamesOf,
  AppModules,
  BodyOfCommand,
  BodyOfQuery,
  Client,
  ClientsOf,
  CommandsCalls,
  CommandsContract,
  NodeIdentifiersOf,
  QueriesCalls,
  QueriesContract,
} from "@dashlane/framework-contracts";
import { safeCast } from "@dashlane/framework-types";
import { RequestContext } from "../request-context/request-context";
export function createCqrsClient<
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> | null,
  TApiName extends ApisNamesOf<TAppDefinition>
>(
  definition: TAppDefinition,
  broker: CqrsBroker<TAppDefinition, TCurrentNode>,
  apiName: TApiName,
  context?: RequestContext
): Client<
  TAppDefinition[TApiName]["api"]["commands"],
  TAppDefinition[TApiName]["api"]["queries"]
> {
  const makeCommands = (): CommandsCalls<
    TAppDefinition[TApiName]["api"]["commands"]
  > => {
    return Object.keys(definition[apiName].api.commands).reduce(
      (result, commandName) => {
        result[commandName] = (
          command: BodyOfCommand<
            TAppDefinition[ApisNamesOf<TAppDefinition>]["api"]["commands"][string]
          >
        ) => {
          const requestContext = context ?? new RequestContext();
          return broker.sendCommand(
            apiName,
            commandName,
            command,
            requestContext
          );
        };
        return result;
      },
      safeCast<CommandsCalls<CommandsContract>>({})
    );
  };
  const makeQueries = (): QueriesCalls<
    TAppDefinition[TApiName]["api"]["queries"]
  > => {
    const queriesDefinitions = definition[apiName].api.queries;
    return Object.keys(queriesDefinitions).reduce((result, queryName) => {
      result[queryName] = (
        query: BodyOfQuery<
          TAppDefinition[ApisNamesOf<TAppDefinition>]["api"]["queries"][string]
        >
      ) => {
        const requestContext = context ?? new RequestContext();
        return broker.sendQuery(apiName, queryName, query, requestContext);
      };
      return result;
    }, safeCast<QueriesCalls<QueriesContract>>({}));
  };
  return {
    commands: makeCommands(),
    queries: makeQueries(),
  };
}
export function createCqrsClients<
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> | null = null
>(
  definition: TAppDefinition,
  broker: CqrsBroker<TAppDefinition, TCurrentNode>
): ClientsOf<AppModules<TAppDefinition>> {
  const aggregate = (
    result: ClientsOf<AppModules<TAppDefinition>>,
    moduleName: ApisNamesOf<TAppDefinition>
  ): ClientsOf<AppModules<TAppDefinition>> => {
    result[moduleName] = createCqrsClient(definition, broker, moduleName);
    return result;
  };
  return Object.keys(definition)
    .map((key) => key as ApisNamesOf<TAppDefinition>)
    .reduce(aggregate, {} as ClientsOf<AppModules<TAppDefinition>>);
}
