import { Observable } from "rxjs";
import { PlatformString } from "@dashlane/communication";
import { Middleware } from "Shared/Middleware";
import { CoreServices } from "Services";
import {
  Command,
  CommandHandler,
  Commands,
  LiveQueries,
  LiveQuery,
  Queries,
  Query,
  QuerySelector,
  RequestType,
  ResultType,
  StaticDataHandler,
} from "Shared/Api";
import { StateOperator } from "Shared/Live";
import { State } from "Store";
export type CommonRegistrationConfig = {
  allowedPlatforms?: PlatformString[];
};
export type CommandRegistrationConfig<C extends Command<unknown, unknown>> =
  CommonRegistrationConfig & {
    handler: CommandHandler<C>;
  };
export type QueryRegistrationConfig<Q extends Query<unknown, unknown>> =
  CommonRegistrationConfig &
    (
      | {
          selector: QuerySelector<Q>;
          selectorFactory?: never;
          staticDataHandler?: never;
        }
      | {
          selector?: never;
          selectorFactory?: never;
          staticDataHandler: StaticDataHandler<Q>;
        }
      | {
          selector?: never;
          selectorFactory: (
            coreServices: CoreServices
          ) => Promise<QuerySelector<Q>>;
          staticDataHandler?: never;
        }
    );
export type LiveQueryRegistrationConfig<L extends LiveQuery<unknown, unknown>> =
  CommonRegistrationConfig &
    (
      | {
          operator: (arg: RequestType<L>) => StateOperator<ResultType<L>>;
          operatorFactory?: never;
          subject?: never;
        }
      | {
          operator?: never;
          operatorFactory?: never;
          subject: (arg: RequestType<L>) => Observable<ResultType<L>>;
        }
      | {
          operator?: never;
          operatorFactory?: (
            state: State,
            coreServices: CoreServices
          ) => Promise<(arg: RequestType<L>) => StateOperator<ResultType<L>>>;
          subject?: never;
        }
    );
export type NoCommands = {
  [k: string]: never;
};
export type NoQueries = {
  [k: string]: never;
};
export type NoLiveQueries = {
  [k: string]: never;
};
export type CommandQueryBusConfig<
  C extends Commands = Commands,
  Q extends Queries = Queries,
  L extends LiveQueries = LiveQueries
> = {
  commands: {
    [K in keyof C]: CommandRegistrationConfig<C[K]>;
  };
  queries: {
    [K in keyof Q]: QueryRegistrationConfig<Q[K]>;
  };
  liveQueries: {
    [K in keyof L]: LiveQueryRegistrationConfig<L[K]>;
  };
};
export type CommandBusMiddlewareCtx<C extends Command<unknown, unknown>> = {
  arg: RequestType<C>;
  config: CommandRegistrationConfig<C>;
  logTags: string[];
  messageName: string;
  messageType: "command";
  requestId: string;
  result?: ResultType<C>;
  services: CoreServices;
};
export type QueryBusMiddlewareCtx<Q extends Query<unknown, unknown>> = {
  arg: RequestType<Q>;
  config: QueryRegistrationConfig<Q>;
  logTags: string[];
  messageName: string;
  messageType: "query";
  requestId: string;
  result?: ResultType<Q>;
  services: CoreServices;
};
export type CommandBusMiddleware<C extends Command<unknown, unknown>> =
  Middleware<Promise<CommandBusMiddlewareCtx<C>>>;
export type QueryBusMiddleware<Q extends Command<unknown, unknown>> =
  Middleware<Promise<QueryBusMiddlewareCtx<Q>>>;
