import { idleQueryState } from "@dashlane/webextensions-apis";
import { SessionConfig } from "./session-infra";
export class WebExtensionSessionConfig extends SessionConfig {
  async isUserIdle(intervalSeconds: number): Promise<boolean> {
    const idleState = await idleQueryState(intervalSeconds);
    return idleState === "idle";
  }
}
