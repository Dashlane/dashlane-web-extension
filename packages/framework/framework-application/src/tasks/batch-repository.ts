import {
  Base64Codec,
  JsonSerializationCodec,
} from "@dashlane/framework-services";
import { Inject } from "@nestjs/common";
import { ModuleApiNameProviderToken } from "../dependency-injection/module.internal";
import { KeyValueStorageInfrastructure } from "../state/storage/types";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../request-context/request-context";
export interface BatchState {
  queue: string[];
  lastStartedChunkSize?: number;
  lastStartedChunkFirstId?: string;
}
const serializationCodec = new JsonSerializationCodec();
const transportCoded = new Base64Codec();
export class BatchStateRepository {
  private readonly prefix: string;
  constructor(
    private kv: KeyValueStorageInfrastructure,
    context: RequestContext,
    @Inject(ModuleApiNameProviderToken)
    moduleName: string
  ) {
    this.prefix = `batch-storage.${moduleName}.${context.get<string>(
      FrameworkRequestContextValues.UserName
    )}`;
  }
  public async getBatchState(name: string): Promise<BatchState> {
    const str = await this.kv.get(`${this.prefix}.${name}`);
    if (!str) {
      return { queue: [] };
    }
    return this.stringToState(str);
  }
  public async setBatchState(name: string, state: BatchState): Promise<void> {
    const stateStr = this.stateToString(state);
    return await this.kv.set(`${this.prefix}.${name}`, stateStr);
  }
  private stateToString(state: BatchState) {
    const serialized = serializationCodec.encode(state);
    return transportCoded.encode(serialized);
  }
  private stringToState(str: string) {
    const buff = transportCoded.decode(str);
    const deSerialized = serializationCodec.decode(buff);
    return deSerialized as BatchState;
  }
}
