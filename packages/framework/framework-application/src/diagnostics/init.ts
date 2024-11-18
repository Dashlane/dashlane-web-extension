import { ObservableValue } from "@dashlane/framework-types";
import { FrameworkInit, OnFrameworkInit } from "../dependency-injection";
import { AppLifeCycle } from "../application/app-lifecycle";
import { LogEventHandler } from "./log-handler";
import { DiagnosticsLogger } from "./diagnostics-logger";
import { DiagnosticsLogsSources } from "./infra";
import { DiagnosticsLog } from "./diagnostics-logger.types";
export type DiagnosticLogEvent = ObservableValue<
  ReturnType<DiagnosticsLogger["getLogsStream$"]>
>;
@FrameworkInit()
export class DiagnosticsInit implements OnFrameworkInit {
  constructor(
    private readonly logsHandler: LogEventHandler,
    private readonly lifeCycle: AppLifeCycle,
    private readonly diagnosticsLogsSources: DiagnosticsLogsSources
  ) {}
  public onFrameworkInit() {
    this.lifeCycle.addAppReadyHook(async () => {
      const sub = this.diagnosticsLogsSources.logsSource.events$.subscribe(
        this.onLogEvent.bind(this)
      );
      return () => {
        sub.unsubscribe();
      };
    });
  }
  private onLogEvent(event: DiagnosticLogEvent) {
    const cleanEvent: DiagnosticsLog = event[0];
    this.logsHandler.handle(cleanEvent);
  }
}
