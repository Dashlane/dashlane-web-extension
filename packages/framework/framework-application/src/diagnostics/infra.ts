import { merge, Subscription } from "rxjs";
import { BufferedStream } from "../communication/buffered-stream";
import { DiagnosticsLogger } from "./diagnostics-logger";
import { DiagnosticsLog, DiagnosticsLogs } from "./diagnostics-logger.types";
export type ProcessorResult = Record<string, boolean>;
export abstract class DiagnosticsLogProcessor {
  abstract process(jobs: DiagnosticsLogs): Promise<ProcessorResult>;
}
export class DiagnosticsLogsSources {
  public logsSource: BufferedStream<DiagnosticsLog, unknown>;
  private sub: Subscription;
  public constructor(
    private events$: ReturnType<DiagnosticsLogger["getLogsStream$"]>[]
  ) {
    this.logsSource = new BufferedStream();
    this.events$ = events$;
    this.sub = merge(...events$).subscribe((event) => {
      this.logsSource.emit(event[0], event[1]);
    });
  }
  getSources() {
    return this.events$;
  }
  addSource(observable: ReturnType<DiagnosticsLogger["getLogsStream$"]>) {
    this.sub.unsubscribe();
    this.events$.push(observable);
    this.sub = merge(...this.events$).subscribe((event) => {
      this.logsSource.emit(event[0], event[1]);
    });
  }
}
