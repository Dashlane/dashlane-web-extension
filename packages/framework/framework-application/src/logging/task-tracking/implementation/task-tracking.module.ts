import { taskTrackingApi } from "@dashlane/framework-contracts";
import { Module } from "../../../dependency-injection/module.decorators";
import { StartTaskTrackingCommandHandler } from "./start-task-tracking.command.handler";
import { TaskTrackingBootstrap } from "./task-tracking-init";
import { TaskTrackingStore } from "./task-tracking.store";
import { TerminateTaskTrackingCommandHandler } from "./terminate-task-tracking.command.handler";
@Module({
  api: taskTrackingApi,
  handlers: {
    commands: {
      startTaskTracking: StartTaskTrackingCommandHandler,
      terminateTaskTracking: TerminateTaskTrackingCommandHandler,
    },
    events: {},
    queries: {},
  },
  stores: [TaskTrackingStore],
  onFrameworkInit: TaskTrackingBootstrap,
  providers: [],
  domainName: "framework",
})
export class TaskTrackingModule {}
