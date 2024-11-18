import { Mutex } from "async-mutex";
import { type ICronTaskHandler } from "../tasks/cron.types";
import { Injectable } from "../dependency-injection/injectable.decorator";
import { DiagnosticsStore } from "./store";
import { DiagnosticsLogProcessor, ProcessorResult } from "./infra";
import { DiagnosticsLogs } from "./diagnostics-logger.types";
const DIAGNOSTIC_LOG_EXPIRATION_PERIOD_MS = 7 * 24 * 3600 * 1000;
const STORE_SET_MUTEX = new Mutex();
@Injectable()
export class DiagnosticsLogsCronHandler implements ICronTaskHandler {
  public constructor(
    private store: DiagnosticsStore,
    private processor: DiagnosticsLogProcessor
  ) {}
  public async isRunnable() {
    const state = await this.store.getState();
    return Object.keys(state.logs).length > 0;
  }
  public async run() {
    const { logs } = await this.store.getState();
    const ids = Object.keys(logs);
    const [validLogs, expiredLogIds] = this.clearExpiredLogs(logs);
    let results: ProcessorResult | undefined;
    try {
      results = await this.processor.process(validLogs);
    } catch (error) {
      console.error("Failed to process diagnotics logs", error);
    }
    if (expiredLogIds.size || Object.values(results ?? {}).some(Boolean)) {
      await STORE_SET_MUTEX.runExclusive(async () => {
        const { logs: currentLogs } = await this.store.getState();
        const updatedLogs = this.clearProcessedOrExpiredLogs(
          ids,
          currentLogs,
          expiredLogIds,
          results
        );
        await this.store.set({ logs: updatedLogs });
      });
    }
  }
  private clearProcessedOrExpiredLogs(
    ids: string[],
    currentLogs: DiagnosticsLogs,
    expiredLogIds: Set<string>,
    results?: ProcessorResult
  ) {
    const updatedLogs = ids.reduce((acc, logId) => {
      if (
        expiredLogIds.has(logId) ||
        (results && (!(logId in results) || results[logId]))
      ) {
        delete acc[logId];
      }
      return acc;
    }, currentLogs);
    return updatedLogs;
  }
  private clearExpiredLogs(
    logs: DiagnosticsLogs
  ): [DiagnosticsLogs, Set<string>] {
    const now = Date.now();
    const expiredLogIds = new Set<string>();
    const nonExpiredLogs = Object.keys(logs).reduce((acc, logId) => {
      const log = logs[logId];
      if (log.timestamp + DIAGNOSTIC_LOG_EXPIRATION_PERIOD_MS <= now) {
        expiredLogIds.add(logId);
        delete acc[logId];
      }
      return acc;
    }, logs);
    return [nonExpiredLogs, expiredLogIds];
  }
}
