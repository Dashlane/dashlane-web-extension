import { UseCaseScope } from "@dashlane/framework-contracts";
import { DiagnosticsInit } from "./init";
import { DiagnosticsLogProcessor, DiagnosticsLogsSources } from "./infra";
import { ExceptionLoggingModule } from "../exception-logging/exception-logging.module";
import { Module } from "../dependency-injection/module.decorators";
import { ModuleDeclaration } from "../dependency-injection/module.types";
import { ParameterProvider } from "../dependency-injection/parameter-provider.types";
import { DiagnosticsLogsCronHandler } from "./crons";
import { DiagnosticsStore } from "./store";
import { LogEventHandler } from "./log-handler";
const DIAGNOSTICS_PROCESSING_INTERVAL_MINUTES = 10;
@Module({
  sharedModuleName: "diagnostics",
  configurations: {
    externalDiagnosticsLogsSources: {
      token: DiagnosticsLogsSources,
    },
    processorAdapter: {
      token: DiagnosticsLogProcessor,
    },
  },
  domainName: "framework",
  onFrameworkInit: [DiagnosticsInit],
  imports: [ExceptionLoggingModule],
  providers: [LogEventHandler],
  crons: [
    {
      handler: DiagnosticsLogsCronHandler,
      periodInMinutes: DIAGNOSTICS_PROCESSING_INTERVAL_MINUTES,
      name: "DiagnosticsCron",
      scope: UseCaseScope.Device,
    },
  ],
  stores: [DiagnosticsStore],
})
export class DiagnosticsModule {
  static configure(config: DiagnosticsModuleConfig): ModuleDeclaration {
    return {
      module: DiagnosticsModule,
      configurations: {
        externalDiagnosticsLogsSources: config.externalDiagnosticsLogsSources,
        processorAdapter: config.processorAdapter,
      },
    };
  }
}
export interface DiagnosticsModuleConfig {
  readonly externalDiagnosticsLogsSources: ParameterProvider<DiagnosticsLogsSources>;
  readonly processorAdapter: ParameterProvider<DiagnosticsLogProcessor>;
}
