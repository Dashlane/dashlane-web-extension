import { logError, logInfo } from "../logs/console/logger";
import { SyncTask, Task, TaskAppPromise, TaskConnectors } from "./tasks.types";
export function makeRunTasksBeforeAppClientReady(
  connectors: TaskConnectors,
  appClient: TaskAppPromise
) {
  return function runTasksBeforeAppClientReady(
    tasks: SyncTask[],
    args?: unknown
  ): void {
    try {
      tasks.forEach((task) => {
        task({ appClient, connectors }, args);
        logInfo({
          message: `${task.name} done`,
          tags: ["amphora", "initBackground", "runTasksBeforeAppClientReady"],
        });
      });
    } catch (error) {
      logError({
        details: { error },
        message: "Error on the making of runTasksBeforeAppClientReady",
        tags: ["amphora", "initBackground", "makeRunTasksBeforeAppClientReady"],
      });
      throw error;
    }
  };
}
export function makeRunTasksAfterAppClientReady(
  connectors: TaskConnectors,
  appClientPromise: TaskAppPromise
) {
  return function runTasksAfterAppClientReady(
    tasks: Task[],
    args?: unknown
  ): void {
    void appClientPromise.then((appClient) => {
      tasks.forEach((task) => {
        task({ appClient, connectors }, args);
        logInfo({
          message: `${task.name} done`,
          tags: ["amphora", "initBackground", "runTasksAfterAppClientReady"],
        });
      });
    });
  };
}
