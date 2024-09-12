import { APP_INTERCEPTOR } from "@nestjs/core";
import { exceptionLoggingApi } from "@dashlane/framework-contracts";
import { ModuleDeclaration } from "../../dependency-injection/module.types";
import { Module } from "../../dependency-injection/module.decorators";
import { ExceptionLogger } from "./exception-logger";
import {
  DEFAULT_EXCEPTION_LOGGING_CONFIG,
  ExceptionLoggingModuleConfig,
} from "./exception-logging.config";
import {
  ExceptionLoggingSink,
  UncaughtErrorSource,
} from "./exception-logging.infra";
import { ExceptionLoggingInit } from "./exception-logging.init";
import { ExceptionLoggingInterceptor } from "./exception-logging.interceptor";
import { UseCaseStacktraceRepository } from "./use-case-stacktrace-repository";
import { UncaughtErrorEventHandler } from "./uncaught-error-handler";
import { ReportAnomalyCommandHandler } from "./handlers/report-anomaly.command.handler";
import { EnableExceptionLogCommandHandler } from "./handlers/enable-exception-log.command.handler";
import { AnomalyReporter } from "./anomaly-reporter";
@Module({
  api: exceptionLoggingApi,
  handlers: {
    commands: {
      reportAnomaly: ReportAnomalyCommandHandler,
      enableExceptionLog: EnableExceptionLogCommandHandler,
    },
    events: {},
    queries: {},
  },
  providers: [
    AnomalyReporter,
    ExceptionLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionLoggingInterceptor,
    },
    UseCaseStacktraceRepository,
    UncaughtErrorEventHandler,
  ],
  configurations: {
    sink: {
      token: ExceptionLoggingSink,
    },
    uncaughtErrorSource: {
      token: UncaughtErrorSource,
    },
  },
  exports: [ExceptionLogger, UseCaseStacktraceRepository],
  onFrameworkInit: ExceptionLoggingInit,
  requiredFeatureFlips: [],
  domainName: "framework",
})
export class ExceptionLoggingModule {
  static configure(config: ExceptionLoggingModuleConfig): ModuleDeclaration {
    return {
      module: ExceptionLoggingModule,
      configurations: {
        ...DEFAULT_EXCEPTION_LOGGING_CONFIG,
        sink: config.sink,
        ...(config.uncaughtErrorSource
          ? { uncaughtErrorSource: config.uncaughtErrorSource }
          : {}),
      },
    };
  }
}
