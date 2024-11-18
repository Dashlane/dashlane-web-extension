import { Injectable } from "../dependency-injection/injectable.decorator";
import { ExceptionLogger } from "./exception-logger";
import { UncaughtErrorEvent } from "./exception-logging.infra";
import { ApplicationRequestError } from "./exception-logging.interceptor";
import { ExceptionCriticalityValues } from "./exception-logging.types";
@Injectable()
export class UncaughtErrorEventHandler {
  public constructor(private readonly logger: ExceptionLogger) {}
  public handle(event: UncaughtErrorEvent) {
    const { error, fileLocation, lineNumber, origin } = event;
    const [exception, useCaseStacktrace] =
      error instanceof ApplicationRequestError
        ? [error.exception, error.useCaseStacktrace]
        : [error];
    return this.logger.captureException(
      exception,
      {
        fileLocation,
        lineNumber,
        origin,
        useCaseStacktrace,
      },
      ExceptionCriticalityValues.CRITICAL
    );
  }
}
