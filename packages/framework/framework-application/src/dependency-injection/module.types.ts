import {
  AnyModuleApi,
  EventMessage,
  RequiredFeatureFlips,
} from "@dashlane/framework-contracts";
import { AbstractClass, Class, InstanceOf } from "@dashlane/framework-types";
import { ParameterProvider } from "../dependency-injection/parameter-provider.types";
import { ICommandHandler } from "../cqrs/commands.types";
import { IEventHandler } from "../cqrs/events.types";
import { IQueryHandler } from "../cqrs/queries.types";
import type { StoreClassDefinition } from "../state/store/store.types";
import { BatchExecutorClassDefinition } from "../tasks/batch.types";
import { CronDefinition } from "../tasks/cron.types";
export interface OnFrameworkInit {
  onFrameworkInit: () => void | Promise<void>;
}
export type ModuleProvidedConfiguration = ParameterProvider<unknown>;
export type ModuleProvidedConfigurations = Record<
  string,
  ModuleProvidedConfiguration
>;
export type ModuleClass = Class<unknown>;
export type ModuleDeclarationShorthand = ModuleClass;
export interface ModuleDeclaration {
  module: ModuleClass;
  configurations?: ModuleProvidedConfigurations;
}
export interface InjectableParameters {
  neverReuseInstance?: boolean;
}
export type HandlersOf<TApi extends AnyModuleApi> = {
  commands: {
    [TCommand in keyof TApi["commands"]]: Class<
      ICommandHandler<InstanceOf<TApi["commands"][TCommand]>>,
      never[]
    >;
  };
  queries: {
    [TQuery in keyof TApi["queries"]]: Class<
      IQueryHandler<InstanceOf<TApi["queries"][TQuery]>>,
      never[]
    >;
  };
  events: {
    [TModule in string]: {
      name: string;
      events: {
        [eventName in string]: Class<
          IEventHandler<EventMessage<unknown>>,
          never[]
        >;
      };
    };
  };
};
export const NullHandlers: HandlersOf<AnyModuleApi> = {
  commands: {},
  events: {},
  queries: {},
};
export type InjectionToken = AbstractClass<unknown> | string;
export interface ModuleConfigurationDeclaration {
  token: InjectionToken;
}
export interface AsyncProvider {
  token: InjectionToken;
  asyncFactory: (...injectedDependencies: never[]) => Promise<unknown>;
  inject?: Array<InjectionToken>;
}
export interface UseClassProvider {
  provide: InjectionToken;
  useClass: Class<unknown>;
}
export type Provider = Class<unknown> | AsyncProvider | UseClassProvider;
export type BaseModuleParams = {
  configurations?: Record<string, ModuleConfigurationDeclaration>;
  providers?: Array<Provider>;
  imports?: Class<unknown>[];
  exports?: Array<Class<unknown> | AbstractClass<unknown>>;
  onFrameworkInit?: Class<OnFrameworkInit> | Class<OnFrameworkInit>[];
  stores?: StoreClassDefinition[];
  requiredFeatureFlips?: RequiredFeatureFlips;
  batchExecutors?: BatchExecutorClassDefinition[];
  crons?: CronDefinition[];
  composes?: BaseModuleParams[];
  domainName?: string;
};
export type CqrsModuleImplementation<TApi extends AnyModuleApi> =
  BaseModuleParams & {
    api: TApi;
    handlers: HandlersOf<TApi>;
    sharedModuleName?: undefined;
  };
export type SharedModuleImplementation = BaseModuleParams & {
  api?: undefined;
  sharedModuleName: string;
  handlers?: undefined;
};
export type ModuleImplementationDefinition<TApi extends AnyModuleApi> =
  | CqrsModuleImplementation<TApi>
  | SharedModuleImplementation;
export const isModuleImplementationDefinition = (
  x: any
): x is ModuleImplementationDefinition<AnyModuleApi> => {
  if (!x || typeof x !== "object") {
    return false;
  }
  if (x.api) {
    if (
      !x.api.commands ||
      !x.api.events ||
      !x.api.name ||
      !x.api.queries ||
      !x.handlers
    ) {
      return false;
    }
  }
  if (x.exports) {
    if (!Array.isArray(x.exports)) {
      return false;
    }
  }
  if (x.handlers) {
    if (!x.api) {
      return false;
    }
  }
  if (x.imports) {
    if (!Array.isArray(x.imports)) {
      return false;
    }
  }
  if (x.providers) {
    if (!Array.isArray(x.providers)) {
      return false;
    }
  }
  return true;
};
export class NodeModulesIntrospection {
  constructor(
    public readonly supportedEventHandlers: Set<Class<unknown>>,
    public readonly modules: Record<
      string,
      ModuleImplementationDefinition<AnyModuleApi>
    >
  ) {}
}
