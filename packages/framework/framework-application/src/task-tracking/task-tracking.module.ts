import { taskTrackingApi } from "@dashlane/framework-contracts";
import { Module } from "../dependency-injection/module.decorators";
import { StartTaskTrackingCommandHandler } from "./start-task-tracking.command.handler";
import { TaskTrackingStore } from "./task-tracking.store";
import { TerminateTaskTrackingCommandHandler } from "./terminate-task-tracking.command.handler";
import { createLoggerProvider } from "../logging";
import { TaskTrackingModuleLogger } from "./task-tracking-logger";
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
  providers: [createLoggerProvider(TaskTrackingModuleLogger)],
  domainName: "framework",
})
export class TaskTrackingModule {}
