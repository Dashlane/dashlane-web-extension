import { REQUEST } from "@nestjs/core";
import { v4 as uuid } from "uuid";
import { AnyCodec } from "@dashlane/framework-services";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { AppLifeCycle } from "../../application/app-lifecycle";
import {
  AsyncProvider,
  Provider,
} from "../../dependency-injection/module.types";
import { scopedSingleton } from "../../dependency-injection/scoped-singleton";
import { IStorage } from "../storage/types";
import { StoreInfrastructureFactory } from "./store-infrastructure-factory";
import { StoreClassDefinition } from "./store.types";
import { ModuleApiNameProviderToken } from "../../dependency-injection/module.internal";
import { createStorageProviders } from "../storage/store-storage-providers.factory";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../../request-context/request-context";
import { AllowedToFail } from "../../errors-handling";
import { UserUseCaseScope } from "../../use-case-scope/user-use-case-scope";
export const DEFAULT_SAVE_DEBOUNCE_TIME = 1000;
function getSingleStoreProviders(StoreType: StoreClassDefinition): Provider[] {
  const storageProviders: Provider[] = StoreType.Definition.persist
    ? createStorageProviders(
        StoreType.Definition.storeName,
        StoreType.Definition.scope,
        StoreType.Definition.storage
      )
    : [];
  const storeProvider: AsyncProvider = {
    token: uuid(),
    inject: [
      ModuleApiNameProviderToken,
      AppLifeCycle,
      StoreInfrastructureFactory,
      StoreType.Definition.scope === UseCaseScope.User
        ? RequestContext
        : REQUEST,
      AllowedToFail,
      UserUseCaseScope,
      ...(StoreType.Definition.persist
        ? [StoreType.Definition.storage, StoreType.Definition.codec]
        : []),
    ],
    asyncFactory: async (
      moduleName: string,
      lifeCycle: AppLifeCycle,
      factory: StoreInfrastructureFactory,
      context: RequestContext,
      allowedToFail: AllowedToFail,
      userScope?: UserUseCaseScope,
      storage?: IStorage,
      codec?: AnyCodec
    ) => {
      const store = new StoreType(
        moduleName,
        StoreType.Definition,
        factory,
        (StoreType.Definition.scope === UseCaseScope.User
          ? context.get<string>(FrameworkRequestContextValues.UserName)
          : "") ?? "",
        allowedToFail,
        storage,
        codec
      );
      const dispose = async () => {
        await store.clear();
        store.stop();
      };
      if (StoreType.Definition.scope === UseCaseScope.User) {
        if (!userScope) {
          throw new Error("No user scope available");
        }
        userScope.addCloseHook(dispose);
      } else {
        lifeCycle.addShutdownHook(dispose);
      }
      await store.load();
      return store;
    },
  };
  return [
    ...storageProviders,
    ...scopedSingleton(StoreType.Definition.scope, StoreType, storeProvider),
  ];
}
export function getStoresProviders(
  ...definitions: StoreClassDefinition[]
): Provider[] {
  return definitions.flatMap((d) => getSingleStoreProviders(d));
}
