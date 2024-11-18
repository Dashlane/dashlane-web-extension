import { config } from "config-service";
import { getSuccess, isSuccess } from "@dashlane/framework-types";
import { BusinessDomain } from "@dashlane/hermes";
import { TaskTrackingClient } from "@dashlane/framework-application";
export class SyncTaskTracker {
  public constructor(private readonly taskTrackingClient: TaskTrackingClient) {}
  public async startTracking() {
    if (config.MANIFEST_VERSION === 3) {
      const startTaskTrackingResult =
        await this.taskTrackingClient.commands.startTaskTracking({
          businessDomain: BusinessDomain.Sync,
          feature: "sync",
          taskName: "sync",
        });
      if (isSuccess(startTaskTrackingResult)) {
        this.taskTrackingId = getSuccess(startTaskTrackingResult).id;
      }
    }
  }
  public terminateTracking() {
    const { taskTrackingId } = this;
    if (config.MANIFEST_VERSION === 3 && taskTrackingId) {
      void this.taskTrackingClient.commands.terminateTaskTracking({
        taskTrackingId,
      });
    }
  }
  private taskTrackingId: string | null = null;
}
