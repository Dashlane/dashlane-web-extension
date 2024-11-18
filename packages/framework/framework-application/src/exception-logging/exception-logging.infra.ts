import { Observable } from "rxjs";
import { ExceptionLogEntry } from "./exception-logging.types";
export interface Stop {
  stop: () => Promise<void>;
}
export abstract class ExceptionLoggingSink {
  abstract logException(logEntry: ExceptionLogEntry): Promise<void>;
  abstract start(): Promise<Stop>;
}
export class NullLoggingSink extends ExceptionLoggingSink {
  logException() {
    return Promise.resolve();
  }
  start(): Promise<Stop> {
    return Promise.resolve({ stop: () => Promise.resolve() });
  }
}
export interface UncaughtErrorEvent {
  readonly error: unknown;
  readonly origin: "uncaughtException" | "unhandledPromiseRejection";
  readonly lineNumber?: number;
  readonly fileLocation?: string;
}
export abstract class UncaughtErrorSource {
  public constructor(public events$: Observable<UncaughtErrorEvent>) {}
}
