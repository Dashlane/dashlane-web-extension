import { Codec } from "@dashlane/framework-services";
import { Class } from "@dashlane/framework-types";
import { IStorage, VersionedData } from "./types";
import { AppLogger } from "../../application";
export type StoreStorageDefinition<TStorage> = {
  schemaVersion: number;
  initialValue: TStorage;
  typeGuard: (item: unknown) => item is TStorage;
  EncryptionCodec?: Class<Codec<ArrayBuffer, ArrayBuffer>>;
  SerializationCodec?: Class<Codec<ArrayBuffer, VersionedData<unknown>>>;
  TransportStorageCodec?: Class<Codec<string, ArrayBuffer>>;
  migrateStorageSchema?: (dataToMigrate: VersionedData<unknown>) => TStorage;
  storageName: string;
  isCache: boolean;
};
export type StoreStorageClassDefinition<TStorage = any> = Class<
  IStorage<TStorage>,
  [
    encryptionCodec: Codec<ArrayBuffer, ArrayBuffer>,
    serializationCodec: Codec<ArrayBuffer, unknown>,
    transportStorageCodec: Codec<string, ArrayBuffer>,
    backend: IStorage<string>,
    appLogger: AppLogger
  ]
> & {
  Definition: StoreStorageDefinition<TStorage>;
};
