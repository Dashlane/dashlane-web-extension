import { EMPTY } from "rxjs";
import { ParameterProvider, provideValue } from "../../dependency-injection";
import {
  ExceptionLoggingSink,
  Stop,
  UncaughtErrorSource,
} from "./exception-logging.infra";
export interface ExceptionLoggingModuleConfig {
  readonly sink: ParameterProvider<ExceptionLoggingSink>;
  readonly uncaughtErrorSource?: ParameterProvider<UncaughtErrorSource>;
}
class NoopExceptionLoggingSink implements ExceptionLoggingSink {
  logException(): Promise<void> {
    return Promise.resolve();
  }
  start(): Promise<Stop> {
    return Promise.resolve({
      stop() {
        return Promise.resolve();
      },
    });
  }
}
class NoopUncaughtErrorSource extends UncaughtErrorSource {
  public constructor() {
    super(EMPTY);
  }
}
export const DEFAULT_EXCEPTION_LOGGING_CONFIG: ExceptionLoggingModuleConfig = {
  sink: provideValue(new NoopExceptionLoggingSink()),
  uncaughtErrorSource: provideValue(new NoopUncaughtErrorSource()),
};
