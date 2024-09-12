import { BatchState, BatchStateRepository } from "./batch-repository";
import { Mutex } from "async-mutex";
import {
  BatchExecutor,
  BatchExecutorClassDefinition,
  BatchExecutorDefinition,
  ChunkProcessor,
} from "./batch.types";
const DEFAULT_CHUNK_SIZE = 16;
const DEFAULT_DECREMENT = 0.5;
const DEFAULT_INCREMENT = 1.3;
export function defineBatchExecutor(
  definition: BatchExecutorDefinition
): BatchExecutorClassDefinition {
  const {
    chunkControl: {
      decrement: chunkDecrement = DEFAULT_DECREMENT,
      increment: chunkIncrement = DEFAULT_INCREMENT,
      initialSize: chunkSize = DEFAULT_CHUNK_SIZE,
    } = {
      decrement: DEFAULT_DECREMENT,
      increment: DEFAULT_INCREMENT,
      initialSize: DEFAULT_CHUNK_SIZE,
    },
  } = definition;
  function getNextChunkSize(state: BatchState) {
    const { lastStartedChunkFirstId, lastStartedChunkSize = chunkSize } = state;
    if (!lastStartedChunkFirstId) {
      return chunkSize;
    }
    const finishedLastChunk = !state.queue.find(
      (itemId) => itemId === lastStartedChunkFirstId
    );
    return Math.max(
      1,
      finishedLastChunk
        ? Math.ceil(lastStartedChunkSize * chunkIncrement)
        : Math.floor(lastStartedChunkSize * chunkDecrement)
    );
  }
  const mutex = new Mutex();
  return class implements BatchExecutor {
    public static readonly Definition: BatchExecutorDefinition = definition;
    constructor(
      private repository: BatchStateRepository,
      private processor: ChunkProcessor
    ) {}
    public async dispatchBatch(items: string[]): Promise<void> {
      await mutex.runExclusive(async () => {
        const state = await this.pushItemsInQueue(items);
        while (state.queue.length > 0) {
          await this.processOneChunkFromQueue(state);
        }
      });
    }
    private async pushItemsInQueue(items: string[]): Promise<BatchState> {
      const state = await this.repository.getBatchState(definition.name);
      const toPushIds = items.filter(
        (itemId) => !state.queue.find((queuedItemId) => queuedItemId === itemId)
      );
      if (toPushIds.length) {
        state.queue.push(...toPushIds);
        await this.repository.setBatchState(definition.name, state);
      }
      return state;
    }
    private async processOneChunkFromQueue(state: BatchState) {
      const newChunkSize = getNextChunkSize(state);
      const attemptChunkSize = Math.min(newChunkSize, state.queue.length);
      if (!attemptChunkSize) {
        throw new Error("Should have something to process");
      }
      await this.repository.setBatchState(definition.name, {
        ...state,
        lastStartedChunkSize: attemptChunkSize,
        lastStartedChunkFirstId: state.queue[0],
      });
      const chunkIds = state.queue.splice(0, attemptChunkSize);
      await this.processor.processChunk(chunkIds);
      await this.repository.setBatchState(definition.name, state);
    }
  };
}
