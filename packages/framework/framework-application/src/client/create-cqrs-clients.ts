import { catchError, defer, finalize, shareReplay, tap } from "rxjs";
import { ContextIdFactory } from "@nestjs/core/helpers/context-id-factory.js";
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
  QueryMessage,
} from "@dashlane/framework-contracts";
import {
  AnyFunctionalError,
  Class,
  isSuccess,
  safeCast,
} from "@dashlane/framework-types";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../request-context/request-context";
import {
  IObservableQueriesCacheFor,
  ObservableQueriesCacheBase,
} from "./observable-queries-cache";
import { USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY } from "../exception-logging/use-case-stacktrace-repository";
export function createCqrsClient<
  TAppDefinition extends AnyAppDefinition,
  TApiName extends ApisNamesOf<TAppDefinition>,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> | null = NodeIdentifiersOf<TAppDefinition>
>(
  currentNodeOrClientName: TCurrentNode | string,
  definition: TAppDefinition,
  broker: CqrsBroker<TAppDefinition, TCurrentNode>,
  apiName: TApiName,
  queriesCache?: ObservableQueriesCacheBase<TAppDefinition>,
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
        result[commandName] = async (
          command: BodyOfCommand<
            TAppDefinition[ApisNamesOf<TAppDefinition>]["api"]["commands"][string]
          >
        ) => {
          const requestContext =
            context ??
            new RequestContext().withValue(
              FrameworkRequestContextValues.UseCaseId,
              String(ContextIdFactory.create().id)
            );
          console.debug(
            `[${currentNodeOrClientName}] Sending ${apiName}.${commandName} command`,
            `(id: ${requestContext.get(
              FrameworkRequestContextValues.UseCaseId
            )})`,
            `(useCaseName: ${requestContext.get(
              USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY
            )})`
          );
          const commandResult = await broker.sendCommand(
            apiName,
            commandName,
            command,
            requestContext
          );
          console.debug(
            `[${currentNodeOrClientName}] Received ${apiName}.${commandName} command result`,
            `(id: ${requestContext.get(
              FrameworkRequestContextValues.UseCaseId
            )})`,
            `(useCaseName: ${requestContext.get(
              USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY
            )})`,
            `(success: ${isSuccess(commandResult)})`
          );
          return commandResult;
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
        const useCache =
          queriesDefinitions[queryName].metadata.useCache ?? false;
        let cache:
          | IObservableQueriesCacheFor<
              Class<
                QueryMessage<unknown, unknown, AnyFunctionalError>,
                unknown[]
              >
            >
          | undefined = undefined;
        if (useCache && queriesCache) {
          cache = queriesCache.for(definition, apiName, queryName, query);
          const cachedQuery$ = cache.get();
          if (cachedQuery$) {
            return cachedQuery$;
          }
        }
        const requestContext =
          context ??
          new RequestContext().withValue(
            FrameworkRequestContextValues.UseCaseId,
            String(ContextIdFactory.create().id)
          );
        function createQuery() {
          console.debug(
            `[${currentNodeOrClientName}] Sending ${apiName}.${queryName} ${
              queryName === "carbonState" ? JSON.stringify(query) + " " : ""
            }observable query`,
            `(id: ${requestContext.get(
              FrameworkRequestContextValues.UseCaseId
            )})`,
            `(useCaseName: ${requestContext.get(
              USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY
            )})`
          );
          const queryResult$ = broker
            .sendQuery(apiName, queryName, query, requestContext)
            .pipe(
              tap((queryResult) => {
                console.debug(
                  `[${currentNodeOrClientName}] Received ${apiName}.${queryName} observable query value`,
                  ...([
                    "session.selectedOpenSession",
                    "vault-access.isAllowed",
                    "authentication-flow.authenticationFlowStatus",
                  ].includes(apiName)
                    ? [`(result: ${JSON.stringify(queryResult)})`]
                    : []),
                  `(id: ${requestContext.get(
                    FrameworkRequestContextValues.UseCaseId
                  )})`,
                  `(useCaseName: ${requestContext.get(
                    USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY
                  )})`,
                  `(success: ${isSuccess(queryResult)})`
                );
              }),
              catchError((err) => {
                console.debug(
                  `[${currentNodeOrClientName}] Exception during ${apiName}.${queryName} observable query`,
                  `(id: ${requestContext.get(
                    FrameworkRequestContextValues.UseCaseId
                  )})`,
                  `(useCaseName: ${requestContext.get(
                    USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY
                  )})`
                );
                throw err;
              }),
              finalize(() => {
                console.debug(
                  `[${currentNodeOrClientName}] Completed ${apiName}.${queryName} observable query`,
                  `(id: ${requestContext.get(
                    FrameworkRequestContextValues.UseCaseId
                  )})`,
                  `(useCaseName: ${requestContext.get(
                    USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY
                  )})`
                );
              })
            );
          console.debug(
            `[${currentNodeOrClientName}] Received ${apiName}.${queryName} observable query`,
            `(id: ${requestContext.get(
              FrameworkRequestContextValues.UseCaseId
            )})`,
            `(useCaseName: ${requestContext.get(
              USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY
            )})`
          );
          return queryResult$;
        }
        if (useCache && cache) {
          const replayedQuery$ = defer(() => createQuery()).pipe(
            finalize(() => cache?.invalidate()),
            shareReplay(1)
          );
          cache.set(replayedQuery$);
          return replayedQuery$;
        }
        const query$ = createQuery();
        return query$;
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
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> | null = NodeIdentifiersOf<TAppDefinition>
>(
  clientName: TCurrentNode | string,
  definition: TAppDefinition,
  broker: CqrsBroker<TAppDefinition, TCurrentNode>,
  queriesCache: ObservableQueriesCacheBase<TAppDefinition>
): ClientsOf<AppModules<TAppDefinition>> {
  const aggregate = (
    result: ClientsOf<AppModules<TAppDefinition>>,
    moduleName: ApisNamesOf<TAppDefinition>
  ): ClientsOf<AppModules<TAppDefinition>> => {
    result[moduleName] = createCqrsClient(
      clientName,
      definition,
      broker,
      moduleName,
      queriesCache
    );
    return result;
  };
  return Object.keys(definition)
    .map((key) => key as ApisNamesOf<TAppDefinition>)
    .reduce(aggregate, {} as ClientsOf<AppModules<TAppDefinition>>);
}
