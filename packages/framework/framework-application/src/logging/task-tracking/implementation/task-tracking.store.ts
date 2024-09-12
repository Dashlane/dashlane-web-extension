import { UseCaseScope } from "@dashlane/framework-contracts";
import { defineStore } from "../../../state/store/define-store";
import { StoreCapacity } from "../../../state/store/define-store.types";
import { TaskTrackingState } from "./task-tracking.types";
const isTaskTrackingState = (state: unknown): state is TaskTrackingState => {
  return (
    typeof state === "object" &&
    state !== null &&
    "swStartTime" in state &&
    "taskTrackingList" in state &&
    typeof state.swStartTime === "string" &&
    typeof state.taskTrackingList === "object"
  );
};
export class TaskTrackingStore extends defineStore<
  TaskTrackingState,
  TaskTrackingState
>({
  persist: false,
  initialValue: {
    swStartTime: "",
    taskTrackingList: {},
  },
  scope: UseCaseScope.Device,
  storeName: "task-tracking",
  storeTypeGuard: isTaskTrackingState,
  capacity: StoreCapacity._001KB,
}) {}
