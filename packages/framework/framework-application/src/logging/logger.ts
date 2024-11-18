import { DiagnosticsLogger } from "../diagnostics/diagnostics-logger";
import { DiagnosticsInfra } from "../diagnostics/diagnostics-logger.types";
import { LogPrinter } from "./printer";
import { LogContent, LogLocationContextInfo, LogSeverities } from "./types";
export interface MetadataType {
  [key: string]: string | number | Error | unknown;
}
export class AppLogger {
  static create(
    params: LogLocationContextInfo & {
      printer?: LogPrinter;
      infra: DiagnosticsInfra;
    }
  ) {
    const diagnosticsLogger = DiagnosticsLogger.create({
      container: params.container,
      module: params.module,
      domain: params.domain,
      infra: params.infra,
    });
    const defaultPrinter =
      process.env.NODE_ENV === "__REDACTED__"
        ? LogPrinter.createProd()
        : LogPrinter.create();
    let printer = params.printer ?? defaultPrinter;
    return new AppLogger(printer, diagnosticsLogger, params);
  }
  public static createNull(
    params: Partial<LogLocationContextInfo> & {
      printer?: LogPrinter;
      infra?: DiagnosticsInfra;
    } = {}
  ) {
    const locationContext: LogLocationContextInfo = {
      container: params.container ?? "none",
      module: params.module ?? "none",
      domain: params.domain ?? "none",
    };
    return new AppLogger(
      LogPrinter.createNull(),
      DiagnosticsLogger.createNull({
        ...locationContext,
        infra: params.infra,
      }),
      locationContext
    );
  }
  public fatal(message: string, contextualData?: MetadataType) {
    const log = LogContent.create({
      message,
      severity: LogSeverities.FATAL,
      metadata: {
        ...contextualData,
      },
      ...this.locationContext,
    });
    this.diagnostics.log(log);
    this.printer.print(log);
  }
  public error(message: string, contextualData?: MetadataType) {
    const log = LogContent.create({
      message,
      severity: LogSeverities.ERROR,
      metadata: {
        ...contextualData,
      },
      ...this.locationContext,
    });
    this.diagnostics.log(log);
    this.printer.print(log);
  }
  public warn(message: string, contextualData?: MetadataType) {
    const log = LogContent.create({
      message,
      severity: LogSeverities.WARN,
      metadata: {
        ...contextualData,
      },
      ...this.locationContext,
    });
    this.diagnostics.log(log);
    this.printer.print(log);
  }
  public info(message: string, contextualData?: MetadataType) {
    const log = LogContent.create({
      message,
      severity: LogSeverities.INFO,
      metadata: {
        ...contextualData,
      },
      ...this.locationContext,
    });
    this.diagnostics.log(log);
    this.printer.print(log);
  }
  public log(message: string, contextualData?: MetadataType) {
    this.info(message, contextualData);
  }
  public debug(message: string, contextualData?: MetadataType) {
    const log = LogContent.create({
      message,
      severity: LogSeverities.DEBUG,
      metadata: {
        ...contextualData,
      },
      ...this.locationContext,
    });
    this.diagnostics.log(log);
    this.printer.print(log);
  }
  public trace(message: string, contextualData?: MetadataType) {
    const log = LogContent.create({
      message,
      severity: LogSeverities.TRACE,
      metadata: {
        ...contextualData,
      },
      ...this.locationContext,
    });
    this.diagnostics.log(log);
    this.printer.print(log);
  }
  private constructor(
    private printer: LogPrinter,
    public diagnostics: DiagnosticsLogger,
    private locationContext: LogLocationContextInfo
  ) {}
}
