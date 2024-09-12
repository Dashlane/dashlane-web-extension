export type ShutdownHook = () => void | Promise<void>;
export type StartupHook = () =>
  | void
  | Promise<void>
  | ShutdownHook
  | Promise<ShutdownHook>;
export type ExternalComponentReadyCondition = () => Promise<unknown | void>;
export class AppLifeCycle {
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
  public startup() {
    const promise = this.waitAndTriggerAppReady();
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
  private async waitAndTriggerAppReady() {
    console.log(
      "[background/framework] Waiting for external components before running startup hooks..."
    );
    try {
      await Promise.all(
        this.externalComponentReadyConditions.map((condition) => condition())
      );
    } catch (error) {
      console.error(
        "[background/framework] Failed waiting for external components",
        error
      );
      throw error;
    }
    await this.executeStartupHooks(this.appReadyHooks);
  }
  private async executeStartupHooks(hooks: StartupHook[]) {
    let count = 1;
    while (hooks.length > 0) {
      const hook = hooks.shift();
      if (hook) {
        console.log(`[background/framework] Executing startup hook ${count}`);
        try {
          const shutdownHook = await hook();
          if (shutdownHook) {
            this.addShutdownHook(shutdownHook);
          }
          console.log(
            `[background/framework] Done executing startup hook ${count}`
          );
          count++;
        } catch (error) {
          console.error(
            `[background/framework] Failed executing startup hook`,
            error
          );
          throw error;
        }
      }
    }
  }
}
