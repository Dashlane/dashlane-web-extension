import { AppDefinition } from "@dashlane/application-extension-definition";
import { Connectors } from "../communication/connectors.types";
import { AppModules, ClientsOf } from "@dashlane/framework-contracts";
export type TaskConnectors = Connectors;
export type TaskApp = ClientsOf<AppModules<AppDefinition>>;
export type TaskAppPromise = Promise<TaskApp>;
export interface SyncTaskDependencies {
  appClient: TaskAppPromise;
  connectors: TaskConnectors;
}
export interface TaskDependencies {
  appClient: TaskApp;
  connectors: TaskConnectors;
}
export type SyncTask = (
  taskDependencies: SyncTaskDependencies,
  args?: unknown
) => void;
export type Task = (taskDependencies: TaskDependencies, args?: unknown) => void;
