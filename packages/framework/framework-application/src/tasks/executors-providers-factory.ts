import { FactoryProvider, Provider } from "@nestjs/common";
import { BatchStateRepository } from "./batch-repository";
import { BatchExecutorClassDefinition, ChunkProcessor } from "./batch.types";
export class ExecutorsProvidersFactory {
  getProviders(
    executorsDefinition: BatchExecutorClassDefinition[]
  ): Provider[] {
    if (!executorsDefinition.length) {
      return [];
    }
    const batches: FactoryProvider[] = executorsDefinition.map((Executor) => ({
      provide: Executor,
      inject: [BatchStateRepository, Executor.Definition.chunkProcessor],
      useFactory: (
        storage: BatchStateRepository,
        processor: ChunkProcessor
      ) => {
        return new Executor(storage, processor);
      },
    }));
    const processors: Provider[] = executorsDefinition.map(
      ({ Definition: { chunkProcessor } }) => chunkProcessor
    );
    return [...batches, ...processors, BatchStateRepository];
  }
}
