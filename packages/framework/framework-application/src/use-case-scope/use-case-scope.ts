import { ValuesType } from "@dashlane/framework-types";
import { AppLifeCycle } from "../application/app-lifecycle";
export type UseCaseScopeHook = () => void | Promise<void>;
export const UseCaseScopeStatuses = {
  Open: "open",
  Closed: "closed",
};
export type UseCaseScopeStatus = ValuesType<typeof UseCaseScopeStatuses>;
export class UseCaseScope {
  public constructor(private lifecycle: AppLifeCycle) {
    lifecycle.addShutdownHook(this.onAppShutdown);
  }
  public status: UseCaseScopeStatus = UseCaseScopeStatuses.Open;
  public async close(): Promise<void> {
    while (this.closeHooks.length > 0) {
      const hook = this.closeHooks.pop();
      if (hook) {
        await hook();
      }
    }
    this.status = UseCaseScopeStatuses.Closed;
    this.lifecycle.removeShutdownHook(this.onAppShutdown);
  }
  public addCloseHook(hook: UseCaseScopeHook) {
    this.closeHooks.push(hook);
  }
  private onAppShutdown = () => {
    return this.close();
  };
  private closeHooks: UseCaseScopeHook[] = [];
}
