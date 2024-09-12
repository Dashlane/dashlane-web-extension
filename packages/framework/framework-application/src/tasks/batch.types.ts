import { Class } from "@dashlane/framework-types";
import { BatchStateRepository } from "./batch-repository";
export interface ChunkProcessor {
  processChunk: (chunkIds: string[]) => Promise<void> | void;
}
export interface BatchExecutor {
  dispatchBatch: (itemsIds: string[]) => Promise<void>;
}
export type BatchExecutorChunkControlDefinition =
  | {
      initialSize?: number;
      increment?: undefined;
      decrement?: undefined;
    }
  | {
      initialSize?: number;
      increment: number;
      decrement: number;
    };
export interface BatchExecutorDefinition {
  name: string;
  chunkControl?: BatchExecutorChunkControlDefinition;
  chunkProcessor: Class<ChunkProcessor>;
}
export type BatchExecutorClassDefinition = Class<
  BatchExecutor,
  [storage: BatchStateRepository, processor: ChunkProcessor]
> & {
  Definition: BatchExecutorDefinition;
};
