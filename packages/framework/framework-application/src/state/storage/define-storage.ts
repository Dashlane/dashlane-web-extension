import { Codec } from "@dashlane/framework-services";
import { Storage } from "./storage";
import {
  StoreStorageClassDefinition,
  StoreStorageDefinition,
} from "./storage.types";
import { IStorage } from "./types";
import { AppLogger } from "../../logging/logger";
export const defineStorageClass = <TStorage>(
  definition: StoreStorageDefinition<TStorage>
): StoreStorageClassDefinition<TStorage> => {
  return class extends Storage<TStorage> {
    public static readonly Definition: StoreStorageDefinition<TStorage> =
      definition;
    public constructor(
      encryptionCodec: Codec<ArrayBuffer, ArrayBuffer>,
      serializationCodec: Codec<ArrayBuffer, unknown>,
      transportStorageCodec: Codec<string, ArrayBuffer>,
      backend: IStorage<string>,
      appLogger: AppLogger
    ) {
      super(
        encryptionCodec,
        serializationCodec,
        transportStorageCodec,
        backend,
        definition,
        appLogger
      );
    }
  };
};
