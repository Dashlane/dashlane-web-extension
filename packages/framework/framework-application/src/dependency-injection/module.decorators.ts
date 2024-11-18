import "reflect-metadata";
import { AnyModuleApi, EventMessage } from "@dashlane/framework-contracts";
import { IEventHandler } from "../cqrs/events.types";
import { DASHLANE_DI_MODULE_METADATA } from "./constants";
import {
  AsyncProvider,
  BaseModuleParams,
  Provider as FrameworkProvider,
  ModuleClass,
  ModuleImplementationDefinition,
} from "./module.types";
import { Module as NestModule, Provider as NestProvider } from "@nestjs/common";
import { Class } from "@dashlane/framework-types";
import {
  DomainNameProviderToken,
  ModuleApiNameProviderToken,
} from "./module.internal";
import { ExecutorsProvidersFactory } from "../tasks/executors-providers-factory";
import { getStoresProviders } from "../state/store/store-provider.factory";
function isAsyncProvider(
  provider: FrameworkProvider
): provider is AsyncProvider {
  if (typeof provider !== "object") {
    return false;
  }
  const typedProvider = provider as AsyncProvider;
  return (
    "token" in typedProvider &&
    "asyncFactory" in typedProvider &&
    typeof typedProvider.asyncFactory === "function"
  );
}
export const useEventsOfModule = <TModuleApi extends AnyModuleApi>(
  api: TModuleApi,
  handlers: Partial<{
    [TEname in keyof TModuleApi["events"]]: Class<
      IEventHandler<EventMessage<unknown>>,
      never[]
    >;
  }>
) => {
  return { [api.name]: { name: api.name, events: handlers } };
};
const composeAppendix = <TApi extends AnyModuleApi>(
  params: ModuleImplementationDefinition<TApi>,
  appendix: BaseModuleParams
): ModuleImplementationDefinition<TApi> => {
  const {
    exports = [],
    imports = [],
    providers = [],
    onFrameworkInit = [],
    stores = [],
    crons = [],
  } = params;
  const flattenOnFrameworkInit = [
    onFrameworkInit,
    appendix.onFrameworkInit ?? [],
  ].flat();
  return {
    ...params,
    exports: exports.concat(appendix.exports ?? []),
    imports: imports.concat(appendix.imports ?? []),
    providers: providers.concat(appendix.providers ?? []),
    onFrameworkInit: flattenOnFrameworkInit,
    stores: stores.concat(appendix.stores ?? []),
    crons: crons.concat(appendix.crons ?? []),
  };
};
export function Module<TApi extends AnyModuleApi>(
  params: ModuleImplementationDefinition<TApi>
): ClassDecorator {
  let baseDecorator: ClassDecorator;
  try {
    const { composes = [] } = params;
    params = composes.reduce(
      (acc: ModuleImplementationDefinition<TApi>, val) =>
        composeAppendix(acc, val),
      params
    );
    const {
      exports = [],
      imports = [],
      handlers = { commands: {}, events: {}, queries: {} },
      providers = [],
      onFrameworkInit = [],
      stores,
      batchExecutors,
      crons,
    } = params;
    const moduleName = params.api?.name ?? params.sharedModuleName;
    const storeProviders = moduleName
      ? getStoresProviders(...(stores ?? []))
      : [];
    const executorProviders = moduleName
      ? new ExecutorsProvidersFactory().getProviders(batchExecutors ?? [])
      : [];
    const cronHandlers = (crons ?? []).map((x) => x.handler);
    const allProviders: FrameworkProvider[] = [
      ...providers,
      ...cronHandlers,
      ...storeProviders,
      ...executorProviders,
      ...Object.values(handlers.commands),
      ...Object.values(handlers.queries),
      ...Object.values(handlers.events)
        .map((x) => Object.values(x.events))
        .reduce((list, item) => {
          return [...list, ...item];
        }, new Array<Class<unknown>>()),
      ...(onFrameworkInit instanceof Array
        ? onFrameworkInit
        : [onFrameworkInit]),
      { provide: ModuleApiNameProviderToken, useValue: moduleName },
      {
        provide: DomainNameProviderToken,
        useValue: params.domainName,
      },
    ];
    const { asyncProviders, basicClassProviders } = allProviders.reduce(
      (previous, current) => {
        if (isAsyncProvider(current)) {
          return {
            asyncProviders: [...previous.asyncProviders, current],
            basicClassProviders: previous.basicClassProviders,
          };
        }
        return {
          asyncProviders: previous.asyncProviders,
          basicClassProviders: [...previous.basicClassProviders, current],
        };
      },
      {
        asyncProviders: new Array<AsyncProvider>(),
        basicClassProviders: new Array<NestProvider>(),
      }
    );
    const moduleProviders: NestProvider[] = [
      ...basicClassProviders,
      ...asyncProviders.map((provider) => ({
        provide: provider.token,
        useFactory: provider.asyncFactory,
        inject: provider.inject,
      })),
    ];
    baseDecorator = NestModule({
      exports: exports,
      imports: imports,
      providers: moduleProviders,
    });
    return (target) => {
      Reflect.defineMetadata(DASHLANE_DI_MODULE_METADATA, params, target);
      return baseDecorator(target);
    };
  } catch (error) {
    console.error("[background/framework] Failed to decorate module");
    return (target) => {
      return target;
    };
  }
}
export enum NestModuleMetadataKey {
  PROVIDERS = "providers",
  IMPORTS = "imports",
}
export function getNestModuleMetadata(
  module: ModuleClass,
  metadataKey: NestModuleMetadataKey
): Class<unknown>[] {
  return Reflect.getMetadata(metadataKey, module);
}
