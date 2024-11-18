import {
  LAST_SENT_AT_UPDATED,
  LastSentAtUpdatedAction,
} from "Session/Store/vaultReport/types";
export const vaultReportLastSentAtUpdated = (
  lastSentAt: number | undefined
): LastSentAtUpdatedAction => ({
  type: LAST_SENT_AT_UPDATED,
  lastSentAt,
});
