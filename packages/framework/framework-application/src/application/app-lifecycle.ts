import { ExceptionLogger } from "../exception-logging/exception-logger";
import { ExceptionCriticalityValues } from "../exception-logging/exception-logging.types";
import { AppLogger } from "../logging";
export type ShutdownHook = () => void | Promise<void>;
export type StartupHook = () =>
  | void
  | Promise<void>
  | ShutdownHook
  | Promise<ShutdownHook>;
export type ExternalComponentReadyCondition = () => Promise<unknown | void>;
export class AppLifeCycle {
  constructor(private readonly logger?: AppLogger) {}
  private readonly shutdownHooks: ShutdownHook[] = [];
  private readonly externalComponentReadyConditions: ExternalComponentReadyCondition[] =
    [];
  private readonly appReadyHooks: StartupHook[] = [];
  public addExternalComponentReadyCondition(
    condition: ExternalComponentReadyCondition
  ) {
    this.externalComponentReadyConditions.push(condition);
  }
  public addAppReadyHook(hook: StartupHook) {
    this.appReadyHooks.push(hook);
  }
  public addShutdownHook(hook: ShutdownHook) {
    this.shutdownHooks.push(hook);
  }
  public removeShutdownHook(hook: ShutdownHook) {
    const idx = this.shutdownHooks.indexOf(hook);
    if (idx >= 0) {
      this.shutdownHooks.splice(idx, 1);
    }
  }
  public startup(exceptionLogger?: ExceptionLogger) {
    const promise = this.waitAndTriggerAppReady(exceptionLogger);
    if (!this.externalComponentReadyConditions.length) {
      return promise;
    }
    this.addShutdownHook(async () => await promise);
  }
  public async shutDown(): Promise<void> {
    while (this.shutdownHooks.length > 0) {
      const hook = this.shutdownHooks.pop();
      if (hook) {
        await hook();
      }
    }
  }
  private async waitAndTriggerAppReady(exceptionLogger?: ExceptionLogger) {
    this.logger?.debug(
      `Waiting for external components before running startup hooks`
    );
    const results = await Promise.allSettled(
      this.externalComponentReadyConditions.map((condition) => condition())
    );
    results.forEach((result) => {
      if (result.status !== "rejected") {
        return;
      }
      const cause = result.reason;
      const error = new Error("Failed to init external component", {
        cause,
      });
      this.logger?.error(`${error.message}`, { cause });
      void exceptionLogger?.captureException(
        error,
        {
          origin: "exceptionBoundary",
          domainName: "framework",
          moduleName: "kernel",
        },
        ExceptionCriticalityValues.CRITICAL
      );
    });
    this.logger?.debug(
      " Done waiting for external components before running startup hooks"
    );
    await this.executeStartupHooks(this.appReadyHooks, exceptionLogger);
  }
  private async executeStartupHooks(
    hooks: StartupHook[],
    exceptionLogger?: ExceptionLogger
  ) {
    let count = 1;
    while (hooks.length > 0) {
      const hook = hooks.shift();
      if (hook) {
        this.logger?.debug(`Executing startup hook ${count}`);
        try {
          const shutdownHook = await hook();
          if (shutdownHook) {
            this.addShutdownHook(shutdownHook);
          }
          this.logger?.debug(`Done executing startup hook ${count}`);
          count++;
        } catch (causeError) {
          const error = new Error("Failed executing startup hook", {
            cause: causeError,
          });
          this.logger?.error(`${error.message}`, { cause: causeError });
          void exceptionLogger?.captureException(
            error,
            {
              origin: "exceptionBoundary",
              domainName: "framework",
              moduleName: "kernel",
            },
            ExceptionCriticalityValues.CRITICAL
          );
        }
      }
    }
  }
}
