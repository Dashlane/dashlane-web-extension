import { Injectable } from "../dependency-injection";
import { AppLogger, MetadataType } from "./logger";
import {
  DomainNameProviderToken,
  ModuleApiNameProviderToken,
} from "../dependency-injection/module.internal";
import { KeyValueStorageInfrastructure } from "../state/storage/types";
import { DiagnosticsLogsSources } from "../diagnostics";
import { MemoryKeyValueStorageInfrastructure } from "../state/storage/memory-key-value-storage-infrastructure";
@Injectable()
export class ModuleLogger {
  logger: AppLogger;
  constructor(
    storageKv: KeyValueStorageInfrastructure,
    moduleName: string | undefined,
    domainName: string | undefined
  ) {
    this.logger = AppLogger.create({
      infra: storageKv,
      container: "background",
      module: moduleName ?? "",
      domain: domainName ?? "no-domain",
    });
  }
  static createNull() {
    return new ModuleLogger(
      new MemoryKeyValueStorageInfrastructure(),
      undefined,
      undefined
    );
  }
  info(message: string, contextualData?: Record<string, string>): void {
    this.logger.info(message, contextualData);
  }
  debug(message: string, contextualData?: MetadataType): void {
    this.logger.debug(message, contextualData);
  }
  error(message: string, contextualData?: MetadataType): void {
    this.logger.error(message, contextualData);
  }
  fatal(message: string, contextualData?: MetadataType): void {
    this.logger.fatal(message, contextualData);
  }
  trace(message: string, contextualData?: MetadataType): void {
    this.logger.trace(message, contextualData);
  }
  warn(message: string, contextualData?: MetadataType): void {
    this.logger.warn(message, contextualData);
  }
  log(message: string, contextualData?: MetadataType): void {
    this.logger.log(message, contextualData);
  }
}
export function defineLogger() {
  const result = class extends ModuleLogger {
    constructor(
      infra: KeyValueStorageInfrastructure,
      moduleName: string,
      domainName: string
    ) {
      super(infra, moduleName, domainName);
    }
  };
  Injectable()(result);
  return result;
}
export function createLoggerProvider(LoggerClass: typeof ModuleLogger) {
  return {
    token: LoggerClass,
    inject: [
      KeyValueStorageInfrastructure,
      DiagnosticsLogsSources,
      ModuleApiNameProviderToken,
      DomainNameProviderToken,
    ],
    asyncFactory: async (
      infra: KeyValueStorageInfrastructure,
      diagnosticsLogsSources: DiagnosticsLogsSources,
      moduleName: string,
      domainName: string
    ) => {
      const moduleLogger = new LoggerClass(infra, moduleName, domainName);
      const logger = moduleLogger.logger;
      const stream = logger.diagnostics.getLogsStream$();
      diagnosticsLogsSources.addSource(stream);
      return moduleLogger;
    },
  };
}
