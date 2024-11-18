import { from, Observable, switchMap } from "rxjs";
import { catchError, skip } from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";
import { CarbonServices, CoreServices, getCoreServices } from "Services";
import { Command, LiveQuery, Query, RequestType, ResultType } from "Shared/Api";
import { buildMiddlewarePipeline } from "Shared/Middleware";
import {
  CommandBusMiddleware,
  CommandQueryBusConfig,
  CommandRegistrationConfig,
  LiveQueryRegistrationConfig,
  QueryBusMiddleware,
  QueryRegistrationConfig,
} from "Shared/Infrastructure/CommandQueryBus/types";
import {
  authorizationMiddleware,
  debugMiddleware,
  perfDebugMiddleware,
} from "Shared/Infrastructure/CommandQueryBus/Middleware";
export abstract class CommandQueryBus {
  public constructor(carbonServices: CarbonServices) {
    this.services = getCoreServices(carbonServices);
  }
  public register(config: CommandQueryBusConfig) {
    const {
      commands: commandsConfig,
      queries: queriesConfig,
      liveQueries: liveQueriesConfig,
    } = config;
    Object.keys(commandsConfig).forEach((name) => {
      this._registerCommand(name, commandsConfig[name]);
    });
    Object.keys(queriesConfig).forEach((name) => {
      this._registerQuery(name, queriesConfig[name]);
    });
    Object.keys(liveQueriesConfig).forEach((name) => {
      this._registerLiveQuery(name, liveQueriesConfig[name]);
    });
  }
  protected abstract registerCommand<C extends Command<unknown, unknown>>(
    name: string,
    handler: (r: RequestType<C>) => Promise<ResultType<C>>
  ): void;
  protected abstract registerQuery<Q extends Query<unknown, unknown>>(
    name: string,
    handler: (r: RequestType<Q>) => Promise<ResultType<Q>>
  ): void;
  protected abstract registerLiveQuery<L extends LiveQuery<unknown, unknown>>(
    name: string,
    liveHandler?: (r: RequestType<L> & string) => Observable<ResultType<L>>
  ): void;
  static readonly API_LOG_TAG = "API";
  static readonly COMMAND_LOG_TAG = "Command";
  static readonly QUERY_LOG_TAG = "Query";
  private services: CoreServices;
  private _registerCommand<C extends Command<unknown, unknown>>(
    name: string,
    initialConfig: CommandRegistrationConfig<C>
  ) {
    const handlerCb: CommandBusMiddleware<C> = () => (ctxPromise) =>
      ctxPromise.then(async (ctx) => {
        const { arg, config, services } = ctx;
        const { handler } = config;
        const result = await handler(services, arg);
        return { ...ctx, result };
      });
    const getInitialCtx = (arg: RequestType<C>) =>
      Promise.resolve({
        messageType: "command" as const,
        messageName: name,
        requestId: uuidv4(),
        services: this.services,
        arg,
        config: initialConfig,
        logTags: [CommandQueryBus.API_LOG_TAG, CommandQueryBus.COMMAND_LOG_TAG],
      });
    const middlewares: CommandBusMiddleware<C>[] = [
      debugMiddleware,
      authorizationMiddleware,
      perfDebugMiddleware,
      handlerCb,
    ];
    const cb = (arg: RequestType<C>) => {
      const executeBus = buildMiddlewarePipeline(...middlewares);
      const initialCtx = getInitialCtx(arg);
      const finalCtx = executeBus(initialCtx);
      return finalCtx.then((ctx) => ctx.result);
    };
    this.registerCommand(name, cb);
  }
  private _registerQuery<Q extends Query<unknown, unknown>>(
    name: string,
    config: QueryRegistrationConfig<Q>
  ) {
    const handler: QueryBusMiddleware<Q> = () => (ctxPromise) =>
      ctxPromise.then(async (ctx) => {
        const { arg, services } = ctx;
        const { selector, staticDataHandler, selectorFactory } = config;
        if (selector) {
          const { storeService } = services;
          const result = await selector(storeService.getState(), arg);
          return { ...ctx, result };
        } else if (selectorFactory) {
          const { storeService } = services;
          const createdSelector = await selectorFactory(this.services);
          const result = await Promise.resolve(
            createdSelector(storeService.getState(), arg)
          );
          return { ...ctx, result };
        } else {
          const result = staticDataHandler(arg);
          return { ...ctx, result };
        }
      });
    const getInitialCtx = (arg: RequestType<Q>) =>
      Promise.resolve({
        messageType: "query" as const,
        messageName: name,
        requestId: uuidv4(),
        services: this.services,
        arg,
        config,
        logTags: [CommandQueryBus.API_LOG_TAG, CommandQueryBus.QUERY_LOG_TAG],
      });
    const middlewares = [
      debugMiddleware,
      authorizationMiddleware,
      perfDebugMiddleware,
      handler,
    ] as unknown as QueryBusMiddleware<Q>[];
    const cb = (arg: RequestType<Q>) => {
      const executeBus = buildMiddlewarePipeline(...middlewares);
      const initialCtx = getInitialCtx(arg);
      const finalCtx = executeBus(initialCtx);
      return finalCtx.then((ctx) => ctx.result);
    };
    this.registerQuery(name, cb);
  }
  private _registerLiveQuery<L extends LiveQuery<unknown, unknown>>(
    name: string,
    config: LiveQueryRegistrationConfig<L>
  ) {
    const cb = (arg: RequestType<L>) => {
      const { operator, subject, operatorFactory } = config;
      if (operator) {
        const { storeService } = this.services;
        const state$ = storeService.getState$();
        return state$.pipe(
          operator(arg),
          skip(1),
          catchError((error) => {
            console.error(
              `[background/carbon] Error while processing CarbonApi liveQuery (name:${name})`,
              error
            );
            throw error;
          })
        );
      } else if (operatorFactory) {
        const { storeService } = this.services;
        const state$ = storeService.getState$();
        return from(
          operatorFactory(storeService.getState(), this.services)
        ).pipe(
          switchMap((createdOperator) =>
            state$.pipe(createdOperator(arg), skip(1))
          ),
          catchError((error) => {
            console.error(
              `[background/carbon] Error while processing CarbonApi liveQuery (name:${name})`,
              error
            );
            throw error;
          })
        );
      } else {
        return subject(arg);
      }
    };
    this.registerLiveQuery(name, cb);
  }
}
