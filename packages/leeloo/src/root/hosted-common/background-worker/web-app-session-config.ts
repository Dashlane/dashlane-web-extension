import type { SessionConfig } from "@dashlane/session-core";
import { UserActivityMessage } from "../common/user-activity-message";
export class WebAppSessionConfig implements SessionConfig {
  static lastActivityDate = Date.now();
  isUserIdle(delaySeconds: number): Promise<boolean> {
    const expected = Date.now() - delaySeconds * 1000;
    const userIsIdle = WebAppSessionConfig.lastActivityDate < expected;
    return Promise.resolve(userIsIdle);
  }
}
function updateActivity() {
  WebAppSessionConfig.lastActivityDate = Date.now();
}
self.addEventListener("message", (msg) => {
  if (msg.data.type === UserActivityMessage.type) {
    updateActivity();
  }
});
