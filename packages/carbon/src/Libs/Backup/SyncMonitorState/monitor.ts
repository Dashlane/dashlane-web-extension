import {
  MonitorSync,
  SyncAnnouncementContext,
  SyncAnnouncementTypes,
} from "Libs/Backup/Probe";
import {
  getEmptyState,
  reduceState,
} from "Libs/Backup/SyncMonitorState/monitorState";
import { EventLoggerService } from "Logs/EventLogger";
import { ErrorStep, UserSyncEvent } from "@dashlane/hermes";
interface EventLoggerSyncMonitor {
  monitor: MonitorSync;
  getSyncEvent: () => Partial<UserSyncEvent>;
}
export const makeEventLoggerSyncMonitor = (
  eventLoggerService: EventLoggerService,
  options: {
    sendLogOnSyncComplete: boolean;
  } = {
    sendLogOnSyncComplete: true,
  }
): EventLoggerSyncMonitor => {
  let state = getEmptyState();
  return {
    monitor: async (
      announcement: SyncAnnouncementTypes,
      context: SyncAnnouncementContext
    ) => {
      state = reduceState(state, announcement, context);
      const { syncEvent } = state;
      const shouldSendSyncEvent = options.sendLogOnSyncComplete;
      switch (announcement.type) {
        case "SharingSyncInvalidSyncData":
          await eventLoggerService.logSync(
            new UserSyncEvent({
              errorStep: ErrorStep.Sharing,
              errorName: announcement.errorName,
              itemGroupId: announcement.itemGroupId,
              duration: syncEvent.duration,
              error: syncEvent.error,
              extent: syncEvent.extent,
              fullBackupSize: syncEvent.fullBackupSize,
              incomingDeleteCount: syncEvent.incomingDeleteCount,
              incomingUpdateCount: syncEvent.incomingUpdateCount,
              outgoingDeleteCount: syncEvent.outgoingDeleteCount,
              outgoingUpdateCount: syncEvent.outgoingUpdateCount,
              timestamp: syncEvent.timestamp,
              trigger: syncEvent.trigger,
              treatProblem: syncEvent.treatProblem,
            })
          );
          break;
        case "SyncFinished":
        case "SyncFailed":
          if (shouldSendSyncEvent) {
            await eventLoggerService.logSync(
              new UserSyncEvent({
                duration: syncEvent.duration,
                error: syncEvent.error,
                extent: syncEvent.extent,
                fullBackupSize: syncEvent.fullBackupSize,
                incomingDeleteCount: syncEvent.incomingDeleteCount,
                incomingUpdateCount: syncEvent.incomingUpdateCount,
                outgoingDeleteCount: syncEvent.outgoingDeleteCount,
                outgoingUpdateCount: syncEvent.outgoingUpdateCount,
                timestamp: syncEvent.timestamp,
                trigger: syncEvent.trigger,
                treatProblem: syncEvent.treatProblem,
              })
            );
            eventLoggerService.flushEventQueue();
          }
          break;
      }
    },
    getSyncEvent: () => state.syncEvent,
  };
};
