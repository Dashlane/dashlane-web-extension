import {
  createInitialSyncEvent,
  getSyncEventErrorName,
  getSyncEventExtent,
} from "Libs/Backup/SyncMonitorState/eventLoggerHelpers";
import {
  ChronologicalSyncFinished,
  DecipherFinished,
  SyncAnnouncementContext,
  SyncAnnouncementTypes,
  SyncFailed,
  SyncStarted,
  SyncTypeChanged,
  TreatProblemDiffComputed,
  UploadSucceeded,
} from "Libs/Backup/Probe";
import {
  ErrorName,
  ErrorStep,
  TreatProblem,
  UserSyncEvent,
} from "@dashlane/hermes";
const augmentSyncState = (
  state: State,
  addedSyncEventProperties: Partial<UserSyncEvent>
): State => ({
  ...state,
  syncEvent: {
    ...state.syncEvent,
    ...addedSyncEventProperties,
  },
});
const getTreatProblemReason = (
  transactionsToDownloadCount: number,
  transactionsToUploadCount: number
) => {
  if (transactionsToDownloadCount > 0 && transactionsToUploadCount > 0) {
    return TreatProblem.UploadAndDownload;
  }
  if (transactionsToUploadCount > 0) {
    return TreatProblem.Upload;
  }
  if (transactionsToDownloadCount > 0) {
    return TreatProblem.Download;
  }
  return TreatProblem.NotNeeded;
};
const durationSince = (finalTimestamp: number) => Date.now() - finalTimestamp;
const onSyncStarted = (
  state: State,
  { trigger, syncType }: SyncStarted,
  { timestamp: syncStartTimestamp }: SyncAnnouncementContext
) => {
  const syncEvent = createInitialSyncEvent(
    syncType,
    trigger,
    Math.floor(syncStartTimestamp / 1000)
  );
  return { ...state, syncStartTimestamp, syncEvent };
};
const onChronologicalSyncStarted = (
  state: State,
  { timestamp: chronologicalStartTimestamp }: SyncAnnouncementContext
) => ({
  ...state,
  chronologicalStartTimestamp,
});
const onChronologicalSyncFinished = (
  state: State,
  { fullBackupFileSize }: ChronologicalSyncFinished
) =>
  augmentSyncState(state, {
    duration: {
      ...state.syncEvent.duration,
      chronological: durationSince(state.chronologicalStartTimestamp),
    },
    fullBackupSize: fullBackupFileSize || 0,
  });
const onChronologicalSyncFailed = (state: State) =>
  augmentSyncState(state, {
    duration: {
      ...state.syncEvent.duration,
      chronological: durationSince(state.chronologicalStartTimestamp),
    },
    error: {
      step: ErrorStep.Chronological,
      name: ErrorName.Other,
    },
  });
const onTreatProblemStarted = (
  state: State,
  { timestamp: treatProblemStartTimestamp }: SyncAnnouncementContext
) => ({
  ...state,
  treatProblemStartTimestamp,
});
const onTreatProblemDiffComputed = (
  state: State,
  {
    transactionsToDownloadCount,
    transactionsToUploadCount,
  }: TreatProblemDiffComputed
) =>
  augmentSyncState(state, {
    treatProblem: getTreatProblemReason(
      transactionsToDownloadCount,
      transactionsToUploadCount
    ),
  });
const onTreatProblemFinished = (state: State) =>
  augmentSyncState(state, {
    duration: {
      ...state.syncEvent.duration,
      treat_problem: durationSince(state.treatProblemStartTimestamp),
    },
  });
const onTreatProblemFailed = (state: State) =>
  augmentSyncState(state, {
    duration: {
      ...state.syncEvent.duration,
      treat_problem: durationSince(state.treatProblemStartTimestamp),
    },
    error: {
      step: ErrorStep.TreatProblem,
      name: ErrorName.Other,
    },
  });
const onTreatSharingKeysFailed = (state: State) =>
  augmentSyncState(state, {
    error: {
      step: ErrorStep.TreatProblem,
      name: ErrorName.Other,
    },
  });
const onSharingSyncStarted = (
  state: State,
  { timestamp: sharingSyncStartTimestamp }: SyncAnnouncementContext
) => ({
  ...state,
  sharingSyncStartTimestamp,
});
const onSharingSyncFinished = (state: State) =>
  augmentSyncState(state, {
    duration: {
      ...state.syncEvent.duration,
      sharing: durationSince(state.sharingSyncStartTimestamp),
    },
  });
const onSharingSyncFailed = (state: State) =>
  augmentSyncState(state, {
    duration: {
      ...state.syncEvent.duration,
      sharing: durationSince(state.sharingSyncStartTimestamp),
    },
    error: {
      step: ErrorStep.Sharing,
      name: ErrorName.Other,
    },
  });
const onDecipherFinished = (
  state: State,
  { updatesCount, deletesCount }: DecipherFinished
) => {
  const initialUpdateCount = state.syncEvent.incomingUpdateCount || 0;
  const initialDeleteCount = state.syncEvent.incomingDeleteCount || 0;
  return augmentSyncState(state, {
    incomingUpdateCount: initialUpdateCount + updatesCount,
    incomingDeleteCount: initialDeleteCount + deletesCount,
  });
};
const onUploadSucceeded = (
  state: State,
  { updatedCount, deletedCount }: UploadSucceeded
) => {
  const initialUpdateCount = state.syncEvent.outgoingUpdateCount || 0;
  const initialDeleteCount = state.syncEvent.outgoingDeleteCount || 0;
  return augmentSyncState(state, {
    outgoingUpdateCount: initialUpdateCount + updatedCount,
    outgoingDeleteCount: initialDeleteCount + deletedCount,
  });
};
const onSyncFinished = (state: State) =>
  augmentSyncState(state, {
    duration: {
      ...state.syncEvent.duration,
      sync: durationSince(state.syncStartTimestamp),
    },
  });
const onSyncFailed = (state: State, { error }: SyncFailed) =>
  augmentSyncState(state, {
    duration: {
      ...state.syncEvent.duration,
      sync: durationSince(state.syncStartTimestamp),
    },
    error: {
      ...state.syncEvent.error,
      name: getSyncEventErrorName(error),
    },
  });
const onSyncTypeChanged = (state: State, { syncType }: SyncTypeChanged) =>
  augmentSyncState(state, {
    extent: getSyncEventExtent(syncType),
  });
export interface State {
  syncStartTimestamp: number | null;
  chronologicalStartTimestamp: number | null;
  treatProblemStartTimestamp: number | null;
  sharingSyncStartTimestamp: number | null;
  syncEvent: Partial<UserSyncEvent> | null;
}
export const getEmptyState = (): State => ({
  syncStartTimestamp: null,
  chronologicalStartTimestamp: null,
  treatProblemStartTimestamp: null,
  sharingSyncStartTimestamp: null,
  syncEvent: null,
});
export const reduceState = (
  state: State,
  announcement: SyncAnnouncementTypes,
  context: SyncAnnouncementContext
): State => {
  switch (announcement.type) {
    case "SyncStarted":
      return onSyncStarted(state, announcement, context);
    case "ChronologicalSyncStarted":
      return onChronologicalSyncStarted(state, context);
    case "ChronologicalSyncFinished":
      return onChronologicalSyncFinished(state, announcement);
    case "ChronologicalSyncFailed":
      return onChronologicalSyncFailed(state);
    case "TreatProblemStarted":
      return onTreatProblemStarted(state, context);
    case "TreatProblemDiffComputed":
      return onTreatProblemDiffComputed(state, announcement);
    case "TreatProblemFinished":
      return onTreatProblemFinished(state);
    case "TreatProblemFailed":
      return onTreatProblemFailed(state);
    case "TreatSharingKeysFailed":
      return onTreatSharingKeysFailed(state);
    case "SharingSyncStarted":
      return onSharingSyncStarted(state, context);
    case "SharingSyncFinished":
      return onSharingSyncFinished(state);
    case "SharingSyncFailed":
      return onSharingSyncFailed(state);
    case "DecipherFinished":
      return onDecipherFinished(state, announcement);
    case "UploadSucceeded":
      return onUploadSucceeded(state, announcement);
    case "SyncFinished":
      return onSyncFinished(state);
    case "SyncFailed":
      return onSyncFailed(state, announcement);
    case "SyncTypeChanged":
      return onSyncTypeChanged(state, announcement);
  }
  return state;
};
