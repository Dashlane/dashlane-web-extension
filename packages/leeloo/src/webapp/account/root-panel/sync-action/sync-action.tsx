import * as React from "react";
import { Trigger } from "@dashlane/hermes";
import { useModuleCommands } from "@dashlane/framework-react";
import { syncApi, SyncStatuses } from "@dashlane/sync-contracts";
import { useSyncStatus } from "../../hooks/use-sync-status";
import { SyncActionButton } from "./sync-action-button";
export enum AnimationStatus {
  Error = "error",
  Success = "success",
  Loading = "loading",
  Idle = "idle",
}
const mapProgressStatus = (statusResult?: SyncStatuses): AnimationStatus => {
  switch (statusResult) {
    case SyncStatuses.FAILURE:
      return AnimationStatus.Error;
    case SyncStatuses.SUCCESS:
      return AnimationStatus.Success;
    case SyncStatuses.IN_PROGRESS:
      return AnimationStatus.Loading;
    default:
      return AnimationStatus.Idle;
  }
};
export const SyncAction = ({ children }: { children: React.ReactNode }) => {
  const { sync } = useModuleCommands(syncApi);
  const { watchNextSync, status } = useSyncStatus();
  const handleManualSync = () => {
    watchNextSync();
    sync({ trigger: Trigger.Manual });
  };
  return (
    <SyncActionButton
      status={mapProgressStatus(status)}
      onClick={handleManualSync}
    >
      {children}
    </SyncActionButton>
  );
};
