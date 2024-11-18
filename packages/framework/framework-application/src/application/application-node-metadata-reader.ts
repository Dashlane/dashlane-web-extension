import {
  AnyAppDefinition,
  AnyModuleApi,
  NodeIdentifiersOf,
} from "@dashlane/framework-contracts";
import { Class, safeCast } from "@dashlane/framework-types";
import { Type } from "@nestjs/common";
import { DASHLANE_DI_MODULE_METADATA } from "../dependency-injection/constants";
import {
  isModuleImplementationDefinition,
  ModuleDeclaration,
  ModuleImplementationDefinition,
  OnFrameworkInit,
} from "../dependency-injection/module.types";
import { StoreClassDefinition } from "../state/store/store.types";
import { ModuleCronDefinition } from "../tasks";
import { LocallyImplementedApisOf } from "./app.types";
import { AppLogger } from "../logging/logger";
import { ConfigurationProvider } from "./nest-adapters/app-module";
export const checkIfAllApisAreImplemented = <
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
>(
  appDefinition: TAppDefinition,
  currentNode: NodeIdentifiersOf<AnyAppDefinition>,
  modulesMetadata: Map<
    LocallyImplementedApisOf<TAppDefinition, TCurrentNode>,
    Partial<ModuleImplementationDefinition<AnyModuleApi>>
  >
): void => {
  const implementedApis = new Set([...modulesMetadata.keys()]);
  const exposedApis = new Set(
    Object.values(appDefinition)
      .filter(
        (x) => x.main === currentNode || x.queryOnly.includes(currentNode)
      )
      .map(
        (x) =>
          x.api.name as LocallyImplementedApisOf<TAppDefinition, TCurrentNode>
      )
  );
  const unImplementedApis = [...exposedApis].filter(
    (api) => !implementedApis.has(api)
  );
  const implementationWithoutApis = [...implementedApis].filter(
    (implementation) => !exposedApis.has(implementation)
  );
  if (unImplementedApis.length > 0) {
    console.error(
      "These APIs are not implemented ",
      JSON.stringify(unImplementedApis)
    );
  }
  if (implementationWithoutApis.length > 0) {
    console.error(
      "Some implementations do not have APIS",
      JSON.stringify(implementationWithoutApis)
    );
  }
};
function readConfigsMetadataFromDeclaration(
  logger: AppLogger,
  moduleName: string,
  metadata: ModuleImplementationDefinition<AnyModuleApi>,
  declaration: ModuleDeclaration
) {
  if (!metadata.configurations) {
    return [];
  }
  const { configurations } = metadata;
  const configProviders: ConfigurationProvider[] = [];
  Object.keys(configurations).forEach((configName) => {
    const token = configurations[configName].token;
    const config = declaration.configurations?.[configName];
    if (!config) {
      throw new Error(
        `Missing '${configName}' configuration for '${moduleName}' module`
      );
    }
    configProviders.push({
      ...config,
      provide: token,
    });
  });
  Object.keys(declaration.configurations ?? {}).forEach((configName) => {
    if (!metadata.configurations?.[configName]) {
      logger.error(
        `Unknown '${configName}' configuration for '${moduleName}' module ` +
          `will be unused`
      );
    }
  });
  return configProviders;
}
export type MetadaFromModules<
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
> = {
  configProviders: Array<ConfigurationProvider>;
  modules: Array<Type>;
  modulesMetadata: Map<
    LocallyImplementedApisOf<TAppDefinition, TCurrentNode>,
    Partial<ModuleImplementationDefinition<AnyModuleApi>>
  >;
  onFrameworkInits: Array<{
    moduleName: string;
    initClass: Class<OnFrameworkInit>;
  }>;
  crons: Array<ModuleCronDefinition>;
  eventHandlers: Array<Type>;
  stores: Array<StoreClassDefinition>;
  allDeclarations: Record<string, ModuleImplementationDefinition<AnyModuleApi>>;
};
export const readMetadataFromDeclaration = <
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
>(
  logger: AppLogger,
  modulesDeclaration: ModuleDeclaration[]
): MetadaFromModules<TAppDefinition, TCurrentNode> =>
  modulesDeclaration.reduce(
    (result, declaration) => {
      const metadata = Reflect.getMetadata(
        DASHLANE_DI_MODULE_METADATA,
        declaration.module
      );
      if (!isModuleImplementationDefinition(metadata)) {
        return result;
      }
      const moduleName =
        metadata.api?.name ?? metadata.sharedModuleName ?? "unnamed";
      if (metadata.onFrameworkInit) {
        const mapFrameworkInitClass = (initClass: Class<OnFrameworkInit>) => ({
          moduleName,
          initClass,
        });
        if (metadata.onFrameworkInit instanceof Array) {
          result.onFrameworkInits = result.onFrameworkInits.concat(
            metadata.onFrameworkInit.map(mapFrameworkInitClass)
          );
        } else {
          result.onFrameworkInits.push(
            mapFrameworkInitClass(metadata.onFrameworkInit)
          );
        }
      }
      result.configProviders.push(
        ...readConfigsMetadataFromDeclaration(
          logger,
          moduleName,
          metadata,
          declaration
        )
      );
      if (metadata.api?.name) {
        result.modulesMetadata.set(
          metadata.api.name as LocallyImplementedApisOf<
            TAppDefinition,
            TCurrentNode
          >,
          metadata
        );
      }
      result.modules.push(declaration.module);
      if (metadata.crons) {
        result.crons.push(
          ...metadata.crons.map((cron) => ({ ...cron, moduleName }))
        );
      }
      if (metadata.handlers?.events) {
        result.eventHandlers.push(
          ...Object.values(metadata.handlers.events).flatMap((x) =>
            Object.values(x.events)
          )
        );
      }
      if (metadata.stores) {
        result.stores.push(...metadata.stores);
      }
      result.allDeclarations[moduleName] = metadata;
      return result;
    },
    {
      configProviders: new Array<ConfigurationProvider>(),
      modules: new Array<Type>(),
      modulesMetadata: new Map<
        LocallyImplementedApisOf<TAppDefinition, TCurrentNode>,
        Partial<ModuleImplementationDefinition<AnyModuleApi>>
      >(),
      onFrameworkInits: new Array<{
        moduleName: string;
        initClass: Class<OnFrameworkInit>;
      }>(),
      crons: new Array<ModuleCronDefinition>(),
      eventHandlers: new Array<Type>(),
      stores: new Array<StoreClassDefinition>(),
      allDeclarations: safeCast<
        Record<string, ModuleImplementationDefinition<AnyModuleApi>>
      >({}),
    }
  );
