import {
  defineModuleClient,
  registerModuleClient,
  taskTrackingApi,
} from "@dashlane/framework-contracts";
export abstract class TaskTrackingClient extends defineModuleClient(
  taskTrackingApi
) {}
registerModuleClient(taskTrackingApi, TaskTrackingClient);
