export interface TeamPlansActiveDirectorySyncStatus {
  lastFailedSync: {
    id: 3;
    teamId: number;
    error: string;
    durationMs: number;
    eventDateUnix: number;
  } | null;
  lastSuccessfulSync: {
    id: number;
    teamId: number;
    proposedCount: number;
    reproposedCount: number;
    unproposedCount: number;
    removedCount: number;
    validCount: number;
    durationMs: number;
    eventDateUnix: number;
  } | null;
  failedSyncCount: number;
}
