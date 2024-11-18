import {
  LAST_SENT_AT_UPDATED,
  LastSentAtUpdatedAction,
} from "Session/Store/userActivity/types";
export const userActivityLastSentAtUpdated = (
  lastSentAt: number | undefined
): LastSentAtUpdatedAction => ({
  type: LAST_SENT_AT_UPDATED,
  lastSentAt,
});
