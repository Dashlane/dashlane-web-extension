import { NotificationStatus } from "@dashlane/communication";
import { useNotificationsStatusData } from "./useNotificationsStatusData";
import { DataStatus } from "../types";
export function useHasUserInteractedWithSwitchToMlNotification(): boolean {
  const notificationsStatusData = useNotificationsStatusData();
  if (notificationsStatusData.status !== DataStatus.Success) {
    return false;
  }
  return (
    notificationsStatusData.data.switchToMlAnalysisEngine ===
    NotificationStatus.Interacted
  );
}
