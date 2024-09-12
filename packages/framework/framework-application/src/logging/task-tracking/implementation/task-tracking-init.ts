import { CarbonLegacyClient } from "@dashlane/communication";
import { UserMv3ExtensionTaskInterruptionEvent } from "@dashlane/hermes";
import { AppLifeCycle } from "../../../application/app-lifecycle";
import { FrameworkInit } from "../../../dependency-injection/injectable.decorator";
import { OnFrameworkInit } from "../../../dependency-injection/module.types";
import { TaskTrackingStore } from "./task-tracking.store";
import { TaskTrackingEntry } from "./task-tracking.types";
@FrameworkInit()
export class TaskTrackingBootstrap implements OnFrameworkInit {
  constructor(
    private store: TaskTrackingStore,
    private carbonLegacyClient: CarbonLegacyClient,
    private appLifecycle: AppLifeCycle
  ) {}
  public onFrameworkInit() {
    this.appLifecycle.addAppReadyHook(async () => {
      const state = await this.store.getState();
      const newTaskTrackingList = { ...state.taskTrackingList };
      const tasks = Object.keys(state.taskTrackingList).map(
        async (taskTrackingId) => {
          const { taskName, feature, businessDomain, startTime } = state
            .taskTrackingList[taskTrackingId] as TaskTrackingEntry;
          const event = new UserMv3ExtensionTaskInterruptionEvent({
            businessDomain,
            feature,
            taskName,
            taskStartDateTime: startTime,
            serviceWorkerStartDateTime: state.swStartTime,
          });
          const carbonLegacy = this.carbonLegacyClient;
          await carbonLegacy.commands.carbon({
            name: "logEvent",
            args: [{ event }],
          });
          delete newTaskTrackingList[taskTrackingId];
        }
      );
      await Promise.all(tasks);
      await this.store.set({
        swStartTime: new Date().toISOString(),
        taskTrackingList: newTaskTrackingList,
      });
    });
  }
}
