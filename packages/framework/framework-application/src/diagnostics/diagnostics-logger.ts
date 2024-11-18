import { LogContent, LogLocationContextInfo } from "../logging/types";
import { BufferedStream } from "../communication/buffered-stream";
import { MemoryKeyValueStorageInfrastructure } from "../state/storage/memory-key-value-storage-infrastructure";
import { DiagnosticsInfra, DiagnosticsLog } from "./diagnostics-logger.types";
const DIAGNOSTICS_ID_TTL = 7 * 24 * 60 * 60 * 1000;
export const DIAGNOSTICS_ID_KEY = "diagnostics.logger";
interface DiagnosticsStoreItem {
  id: string;
  ttl: number;
}
function isDiagnosticsStoreItem(item: unknown): item is DiagnosticsStoreItem {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof (item as DiagnosticsStoreItem).id === "string" &&
    typeof (item as DiagnosticsStoreItem).ttl === "number"
  );
}
let diagnosticsId: string | null = null;
let diagnosticsTTL: number | null = null;
let isInitalized = false;
export class DiagnosticsLogger {
  static create(params: {
    container: string;
    module: string;
    domain?: string;
    infra: DiagnosticsInfra;
  }) {
    return new DiagnosticsLogger({ ...params, infra: params.infra });
  }
  static createNull(
    params: LogLocationContextInfo & {
      infra?: DiagnosticsInfra;
    } = {
      container: "null",
      module: "null",
    }
  ) {
    const nullInfra = params.infra ?? new MemoryKeyValueStorageInfrastructure();
    return new DiagnosticsLogger({ ...params, infra: nullInfra });
  }
  public getLogsStream$() {
    return this.bufferedEventStream.events$;
  }
  async startDiagnosticsSession() {
    await this.initDiagnosticSession();
    if (diagnosticsId) {
      return;
    }
    const now = new Date();
    const ttl = now.getTime() + DIAGNOSTICS_ID_TTL;
    diagnosticsId = crypto.randomUUID();
    diagnosticsTTL = ttl;
    const item = {
      id: diagnosticsId,
      ttl,
    };
    await this.infra.set(DIAGNOSTICS_ID_KEY, JSON.stringify(item));
  }
  public async log({ message, severity, metadata, timestamp }: LogContent) {
    await this.initDiagnosticSession();
    if (!this.shouldLog()) {
      return;
    }
    if (diagnosticsId) {
      const diagnosticsLog: DiagnosticsLog = {
        message,
        severity,
        diagnosticsId,
        timestamp,
        container: this.container,
        module: this.module,
        domain: this.domain,
        metadata,
      };
      this.bufferedEventStream.emit(diagnosticsLog, undefined);
    }
  }
  public async clear() {
    await this.infra.remove(DIAGNOSTICS_ID_KEY);
    diagnosticsId = null;
    diagnosticsTTL = null;
  }
  public async getDiagnosticsSessionInfo() {
    await this.initDiagnosticSession();
    return {
      diagnosticsId: diagnosticsId,
      diagnosticsTTL: diagnosticsTTL,
    };
  }
  private async initDiagnosticSession() {
    if (isInitalized) {
      return;
    }
    await this.loadDiagnosticsSessionFromLocalStorage();
    if (!this.isTTLValid(diagnosticsTTL)) {
      this.clear();
    }
    isInitalized = true;
  }
  private constructor(params: {
    container: string;
    module: string;
    domain?: string;
    infra: DiagnosticsInfra;
  }) {
    this.container = params.container;
    this.module = params.module;
    this.domain = params.domain;
    this.infra = params.infra;
    this.bufferedEventStream = new BufferedStream<DiagnosticsLog, unknown>();
  }
  private isTTLValid(ttl: number | null) {
    const now = new Date();
    if (!ttl || now.getTime() > ttl) {
      return false;
    }
    return true;
  }
  private async loadDiagnosticsSessionFromLocalStorage() {
    try {
      const data = await this.infra.get(DIAGNOSTICS_ID_KEY);
      const parsedData = data ? JSON.parse(data) : undefined;
      if (!isDiagnosticsStoreItem(parsedData)) {
        return;
      }
      diagnosticsTTL = parsedData.ttl;
      diagnosticsId = parsedData.id;
    } catch (error) {
      console.error("error", error);
    }
  }
  private shouldLog() {
    return diagnosticsId && this.isTTLValid(diagnosticsTTL);
  }
  private readonly infra: DiagnosticsInfra;
  private readonly container: string;
  private readonly module: string;
  private readonly domain?: string;
  private readonly bufferedEventStream;
}
