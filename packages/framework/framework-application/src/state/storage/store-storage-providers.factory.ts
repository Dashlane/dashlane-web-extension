import { UseCaseScope } from "@dashlane/framework-contracts";
import {
  Base64Codec,
  Codec,
  JsonSerializationCodec,
} from "@dashlane/framework-services";
import { AbstractClass } from "@dashlane/framework-types";
import { scopedSingleton } from "../../dependency-injection/scoped-singleton";
import {
  AsyncProvider,
  Provider,
} from "../../dependency-injection/module.types";
import {
  DefaultEncryptionCodecForDeviceData,
  DefaultEncryptionCodecForUserData,
} from "./default-encryption-codec";
import { KeyValueStorageFactory } from "./key-value-storage-factory";
import { StoreStorageClassDefinition } from "./storage.types";
import { IStorage } from "./types";
import { v4 as uuid } from "uuid";
import { ModuleApiNameProviderToken } from "../../dependency-injection/module.internal";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../../request-context/request-context";
import { AppLogger } from "../../logging/logger";
const DefaultCodecs: Record<
  UseCaseScope,
  AbstractClass<Codec<ArrayBuffer, ArrayBuffer>>
> = {
  [UseCaseScope.Device]: DefaultEncryptionCodecForDeviceData,
  [UseCaseScope.User]: DefaultEncryptionCodecForUserData,
};
export function createStorageProviders(
  storageName: string,
  scope: UseCaseScope,
  StorageType: StoreStorageClassDefinition
): Provider[] {
  const {
    EncryptionCodec = DefaultCodecs[scope],
    SerializationCodec = JsonSerializationCodec,
    TransportStorageCodec = Base64Codec,
    initialValue,
    schemaVersion,
  } = StorageType.Definition;
  class ThisStorageDependencies {
    constructor(
      public encryptionCodec: Codec<ArrayBuffer, ArrayBuffer>,
      public serializationCodec: Codec<ArrayBuffer, unknown>,
      public transportStorageCodec: Codec<string, ArrayBuffer>,
      public backend: IStorage<string>,
      public appLogger: AppLogger
    ) {}
  }
  class BuildableStorage extends StorageType {
    constructor(deps: ThisStorageDependencies) {
      super(
        deps.encryptionCodec,
        deps.serializationCodec,
        deps.transportStorageCodec,
        deps.backend,
        deps.appLogger
      );
    }
  }
  const storageProvider: AsyncProvider = {
    token: uuid(),
    inject: [ThisStorageDependencies],
    asyncFactory: (deps) => Promise.resolve(new BuildableStorage(deps)),
  };
  const depProvider: AsyncProvider = {
    token: ThisStorageDependencies,
    inject: [
      ModuleApiNameProviderToken,
      EncryptionCodec,
      SerializationCodec,
      TransportStorageCodec,
      KeyValueStorageFactory,
      AppLogger,
      ...(scope === UseCaseScope.User ? [RequestContext] : []),
    ],
    asyncFactory: async (
      moduleName: string,
      encryptionCodec: Codec<ArrayBuffer, ArrayBuffer>,
      serializationCodec: Codec<ArrayBuffer, unknown>,
      transportStorageCodec: Codec<string, ArrayBuffer>,
      factory: KeyValueStorageFactory,
      logger: AppLogger,
      context?: RequestContext
    ) => {
      const backend = await factory.createBackend(
        moduleName,
        storageName,
        (scope === UseCaseScope.User
          ? context?.get<string>(FrameworkRequestContextValues.UserName)
          : "") ?? "",
        async () => {
          const formattedData = {
            version: schemaVersion,
            content: initialValue,
          };
          const serialized = await serializationCodec.encode(formattedData);
          const encrypted = await encryptionCodec.encode(serialized);
          return await transportStorageCodec.encode(encrypted);
        }
      );
      return new ThisStorageDependencies(
        encryptionCodec,
        serializationCodec,
        transportStorageCodec,
        backend,
        logger
      );
    },
  };
  return [depProvider, ...scopedSingleton(scope, StorageType, storageProvider)];
}
