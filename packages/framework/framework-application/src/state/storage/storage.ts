import {
  Codec,
  combineCodecs,
  Decoder,
  PassthroughCodec,
} from "@dashlane/framework-services";
import { StoreStorageDefinition } from "./storage.types";
import { IStorage, isVersionedData, VersionedData } from "./types";
import { AppLogger } from "../../application";
const MAX_OBJECT_SHAPE_INFO_STRING_LENGTH = 40;
export class Storage<TStorage> implements IStorage<TStorage> {
  constructor(
    private encryptionCodec: Codec<ArrayBuffer, ArrayBuffer>,
    private serializationCodec: Codec<ArrayBuffer, unknown>,
    private transportStorageCodec: Codec<string, ArrayBuffer>,
    private backend: IStorage<string>,
    private definition: StoreStorageDefinition<TStorage>,
    private appLogger: AppLogger
  ) {
    this.codec = combineCodecs(
      transportStorageCodec,
      encryptionCodec,
      serializationCodec
    );
    const bypassDecryptionCodec: Codec<ArrayBuffer, ArrayBuffer> =
      new PassthroughCodec();
    this.bypassedDecryptionDecoder = combineCodecs(
      transportStorageCodec,
      bypassDecryptionCodec,
      serializationCodec
    );
  }
  async read(): Promise<TStorage | undefined> {
    const backendData = await this.backend.read();
    if (!backendData) {
      return undefined;
    }
    const { decoded, hasBypassedDecryption } = await this.decodeData(
      backendData
    );
    const { definition } = this;
    const { storageName } = definition;
    if (!isVersionedData(decoded)) {
      throw new Error(
        `Unable to read storage data that isn't versioned ` +
          `(storage name: ${storageName}, data shape: ${this.printDataShapeInfo(
            decoded
          )})`
      );
    }
    const { content } = decoded;
    const schemaVersionInStorage = decoded.version;
    const currentSchemaVersion = definition.schemaVersion;
    if (schemaVersionInStorage < currentSchemaVersion) {
      if (!definition.migrateStorageSchema) {
        if (hasBypassedDecryption) {
          await this.rawWrite(decoded);
        }
        throw new Error(
          "Missing storage schema migration function prevents " +
            `from reading old version data (storage name: ${storageName})`
        );
      }
      const newContent = definition.migrateStorageSchema(decoded);
      const safeNewContent = this.getTypecheckedData(newContent, "read");
      await this.writeWithVersion(safeNewContent);
      return safeNewContent;
    } else if (schemaVersionInStorage > currentSchemaVersion) {
      throw new Error(
        "Unable to read storage data with a more recent version" +
          ` than current schema (storage name: ${storageName})`
      );
    } else {
      const safeContent = this.getTypecheckedData(content, "read");
      if (hasBypassedDecryption) {
        await this.writeWithVersion(safeContent);
      }
      return safeContent;
    }
  }
  write(data: TStorage) {
    const safeData = this.getTypecheckedData(data, "write");
    return this.writeWithVersion(safeData);
  }
  clear(): Promise<void> {
    return this.backend.clear();
  }
  private async writeWithVersion(data: TStorage) {
    const formattedData: VersionedData<TStorage> = {
      version: this.definition.schemaVersion,
      content: data,
    };
    await this.rawWrite(formattedData);
  }
  private async rawWrite(data: unknown) {
    const encoded = await this.codec.encode(data);
    await this.backend.write(encoded);
  }
  private async decodeData(backendData: string) {
    const { codec, bypassedDecryptionDecoder } = this;
    try {
      return {
        decoded: await codec.decode(backendData),
        hasBypassedDecryption: false,
      };
    } catch (error) {
      try {
        return {
          decoded: await bypassedDecryptionDecoder.decode(backendData),
          hasBypassedDecryption: true,
        };
      } catch {
        throw error;
      }
    }
  }
  private getTypecheckedData(
    data: unknown,
    operation: "read" | "write"
  ): TStorage {
    try {
      if (!this.definition.typeGuard(data)) {
        throw new Error(`Typeguard check failed`);
      }
    } catch (e) {
      const { storageName, initialValue } = this.definition;
      const errorMessage = `Failed to ${operation} storage data because of typeguard failure`;
      const contextualInfo = {
        details: e instanceof Error ? e.message : "",
        storageInfo: `(storage name: ${storageName}, data shape: ${this.printDataShapeInfo(
          data
        )})`,
      };
      const typeGuardFailError = new Error(errorMessage, {
        cause: JSON.stringify(contextualInfo),
      });
      this.appLogger.error(errorMessage, contextualInfo);
      if (this.definition.isCache) {
        return initialValue;
      }
      throw typeGuardFailError;
    }
    return data;
  }
  private printDataShapeInfo(data: unknown) {
    if (!!data && typeof data === "object") {
      const decodedObj = data as Record<string, unknown>;
      const dataShape = Object.keys(decodedObj).reduce((shape, key) => {
        shape[key] = typeof decodedObj[key];
        return shape;
      }, {} as Record<string, string>);
      return JSON.stringify(dataShape).substring(
        0,
        MAX_OBJECT_SHAPE_INFO_STRING_LENGTH
      );
    } else {
      return data === undefined
        ? "undefined"
        : data === null
        ? "null"
        : typeof data;
    }
  }
  private codec: Codec<string, unknown>;
  private bypassedDecryptionDecoder: Decoder<string, unknown>;
}
