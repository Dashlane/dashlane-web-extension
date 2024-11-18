import { LogContent, LogSeverities } from "./types";
type LogPrinterFn = (content: string, metadata?: object) => void;
interface LogPrinterInfra {
  [LogSeverities.TRACE]: LogPrinterFn;
  [LogSeverities.DEBUG]: LogPrinterFn;
  [LogSeverities.INFO]: LogPrinterFn;
  [LogSeverities.WARN]: LogPrinterFn;
  [LogSeverities.ERROR]: LogPrinterFn;
  [LogSeverities.FATAL]: LogPrinterFn;
}
const NOOP_PRINT = () => {};
export class LogPrinter {
  private constructor(private infra: LogPrinterInfra) {}
  public static createProd() {
    return new LogPrinter({
      [LogSeverities.TRACE]: console.debug,
      [LogSeverities.DEBUG]: console.debug,
      [LogSeverities.INFO]: console.info,
      [LogSeverities.WARN]: console.warn,
      [LogSeverities.ERROR]: console.error,
      [LogSeverities.FATAL]: console.error,
    });
  }
  public static create() {
    return new LogPrinter({
      [LogSeverities.TRACE]: console.debug,
      [LogSeverities.DEBUG]: console.debug,
      [LogSeverities.INFO]: console.info,
      [LogSeverities.WARN]: console.warn,
      [LogSeverities.ERROR]: console.error,
      [LogSeverities.FATAL]: console.error,
    });
  }
  public static createNull() {
    return new LogPrinter({
      [LogSeverities.TRACE]: NOOP_PRINT,
      [LogSeverities.DEBUG]: NOOP_PRINT,
      [LogSeverities.INFO]: NOOP_PRINT,
      [LogSeverities.WARN]: NOOP_PRINT,
      [LogSeverities.ERROR]: NOOP_PRINT,
      [LogSeverities.FATAL]: NOOP_PRINT,
    });
  }
  public print(log: LogContent) {
    const locationPrefix =
      log.container && log.module ? `[${log.container}/${log.module}]` : "";
    this.infra[log.severity](`${locationPrefix} ${log.message}`, log.metadata);
  }
}
