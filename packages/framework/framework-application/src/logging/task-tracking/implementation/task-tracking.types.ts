import { BusinessDomain } from "@dashlane/hermes";
export interface TaskTrackingState {
  swStartTime: string;
  taskTrackingList: Record<string, TaskTrackingEntry | undefined>;
}
export interface TaskTrackingEntry {
  taskName: string;
  feature: string;
  businessDomain: BusinessDomain;
  startTime: string;
  serviceWorkerInterruptionCount: number;
}
