import type { ParameterProvider } from "../dependency-injection/parameter-provider.types";
import { provideValue } from "../dependency-injection/parameter-provider";
import type { DiagnosticsLogs } from "./diagnostics-logger.types";
import { DiagnosticsLogProcessor, type ProcessorResult } from "./infra";
class NoopDiagnosticsLogProcessor extends DiagnosticsLogProcessor {
  public process(jobs: DiagnosticsLogs): Promise<ProcessorResult> {
    return Promise.resolve(
      Object.keys(jobs).reduce((acc, logId) => {
        acc[logId] = false;
        return acc;
      }, {} as ProcessorResult)
    );
  }
}
export const DEFAULT_DIAGNOSTICS_LOGS_PROCESSOR: ParameterProvider<DiagnosticsLogProcessor> =
  provideValue(new NoopDiagnosticsLogProcessor());
