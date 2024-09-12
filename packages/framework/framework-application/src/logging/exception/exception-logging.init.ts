import { ModuleRef } from "@nestjs/core";
import { AppLifeCycle } from "../../application/app-lifecycle";
import { FrameworkInit } from "../../dependency-injection/injectable.decorator";
import { OnFrameworkInit } from "../../dependency-injection/module.types";
import {
  ExceptionLoggingSink,
  UncaughtErrorEvent,
  UncaughtErrorSource,
} from "./exception-logging.infra";
import { UncaughtErrorEventHandler } from "./uncaught-error-handler";
@FrameworkInit()
export class ExceptionLoggingInit implements OnFrameworkInit {
  constructor(
    private readonly sink: ExceptionLoggingSink,
    private readonly lifeCycle: AppLifeCycle,
    private readonly moduleRef: ModuleRef,
    private readonly uncaughtErrorsSource: UncaughtErrorSource
  ) {}
  public onFrameworkInit() {
    this.lifeCycle.addAppReadyHook(async () => {
      const { stop } = await this.sink.start();
      const sub = this.uncaughtErrorsSource.events$.subscribe(
        this.onUncaughtErrorEvent.bind(this)
      );
      return () => {
        sub.unsubscribe();
        stop();
      };
    });
  }
  private onUncaughtErrorEvent(event: UncaughtErrorEvent) {
    const handler = this.moduleRef.get(UncaughtErrorEventHandler);
    void handler.handle(event);
  }
}
