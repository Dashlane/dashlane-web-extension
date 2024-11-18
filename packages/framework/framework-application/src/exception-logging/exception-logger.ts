import { Injectable } from "@nestjs/common";
import { AppLogger } from "../logging/logger";
import {
  ExceptionLoggingSink,
  NullLoggingSink,
} from "./exception-logging.infra";
import {
  ExceptionCaptureContext,
  ExceptionCriticality,
  ExceptionCriticalityValues,
  ExceptionLogEntry,
} from "./exception-logging.types";
@Injectable()
export class ExceptionLogger {
  private enableExceptionLogsSend = true;
  public constructor(
    private sink: ExceptionLoggingSink,
    private logger: AppLogger
  ) {}
  public setEnableExceptionLogsSend(flag: boolean): void {
    this.enableExceptionLogsSend = flag;
  }
  public captureException(
    exception: unknown,
    context: ExceptionCaptureContext,
    criticality: ExceptionCriticality = ExceptionCriticalityValues.CRITICAL
  ): Promise<void> {
    if (!this.enableExceptionLogsSend) {
      return Promise.resolve();
    }
    try {
      const typedException =
        exception instanceof Error
          ? exception
          : new Error("Invalid exception type", { cause: exception });
      const exceptionLogEntry = this.createExceptionLogEntry(
        context,
        typedException,
        criticality
      );
      return this.sink.logException(exceptionLogEntry);
    } catch (err) {
      this.logger.warn("Failed to capture exception", {
        fileLocation: context.fileLocation ?? "",
        lineNumber: String(context.lineNumber),
        moduleName: context.moduleName ?? "",
        domainName: context.domainName ?? "",
        origin: context.origin ?? "",
        useCaseId: context.useCaseId ?? "",
        useCaseName: context.useCaseName ?? "",
        useCaseStacktrace: String(context.useCaseStacktrace),
      });
    }
    return Promise.resolve();
  }
  private createExceptionLogEntry(
    context: ExceptionCaptureContext,
    error: Error,
    criticality: ExceptionCriticality
  ): ExceptionLogEntry {
    return {
      callStack: error.stack ?? "",
      criticality,
      featuresFlipped: this.mapFeatures(context.featureFlips ?? {}),
      fileLocation: context.fileLocation,
      lineNumber: context.lineNumber,
      message: error.message,
      moduleName: context.moduleName,
      domainName: context.domainName,
      origin: context.origin,
      timestamp: Date.now(),
      useCaseId: context.useCaseId,
      useCaseName: context.useCaseName,
      useCaseStacktrace: context.useCaseStacktrace,
      cause: JSON.stringify(
        error.cause instanceof Error
          ? { message: error.cause.message, stack: error.cause.stack }
          : error.cause
      ),
    };
  }
  private mapFeatures(featureFlips: Record<string, boolean | undefined>) {
    return Object.keys(featureFlips).reduce((flippedList, featureName) => {
      return featureFlips[featureName]
        ? [featureName, ...flippedList]
        : flippedList;
    }, [] as string[]);
  }
}
export function createNullExceptionLogger() {
  return new ExceptionLogger(new NullLoggingSink(), AppLogger.createNull());
}
