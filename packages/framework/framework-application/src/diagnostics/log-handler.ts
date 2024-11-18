import { v4 as uuidV4 } from "uuid";
import { Injectable } from "@nestjs/common";
import { Mutex } from "async-mutex";
import debounce from "lodash.debounce";
import { ExceptionLogger } from "../exception-logging/exception-logger";
import { DiagnosticsLog, DiagnosticsLogs } from "./diagnostics-logger.types";
import { DiagnosticsStore } from "./store";
export const DIAGNOSTIC_LOGS_STORAGE_BUCKET = "diagnostic-logs";
const MUTEX = new Mutex();
@Injectable()
export class LogEventHandler {
  private queue: DiagnosticsLogs = {};
  private debouncedPersistLocally: ReturnType<typeof debounce>;
  constructor(
    private exceptionLogger: ExceptionLogger,
    private store: DiagnosticsStore
  ) {
    this.debouncedPersistLocally = debounce(
      this.persistLogsLocally.bind(this),
      1000,
      {
        maxWait: 5000,
      }
    );
  }
  public handle(event: DiagnosticsLog) {
    const id = uuidV4();
    this.queue = {
      ...this.queue,
      [id]: event,
    };
    this.debouncedPersistLocally();
  }
  async persistLogsLocally() {
    const queueLogs = { ...this.queue };
    this.queue = {};
    try {
      await MUTEX.runExclusive(async () => {
        const currStore = await this.store.getState();
        await this.store.set({
          logs: { ...currStore.logs, ...queueLogs },
        });
      });
    } catch (e) {
      this.queue = { ...queueLogs };
      this.exceptionLogger.captureException(e, {
        domainName: "framework",
        moduleName: "diagnostics",
        origin: "exceptionBoundary",
      });
    }
  }
}
