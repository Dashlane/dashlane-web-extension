import { Codec } from "@dashlane/framework-services";
import { Class } from "@dashlane/framework-types";
import { VersionedData } from "./types";
export type StoreStorageConfiguration<TStorage> = {
  schemaVersion: number;
  initialValue: TStorage;
  typeGuard: (item: unknown) => item is TStorage;
  EncryptionCodec?: Class<Codec<ArrayBuffer, ArrayBuffer>>;
  SerializationCodec?: Class<Codec<ArrayBuffer, VersionedData<unknown>>>;
  TransportStorageCodec?: Class<Codec<string, ArrayBuffer>>;
  migrateStorageSchema?: (dataToMigrate: VersionedData<unknown>) => TStorage;
};
