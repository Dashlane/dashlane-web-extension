import {
  LAST_SENT_AT_UPDATED,
  VaultReportAction,
  VaultReportState,
} from "Session/Store/vaultReport/types";
export default (
  state = getEmptyVaultReportState(),
  action: VaultReportAction
): VaultReportState => {
  switch (action.type) {
    case LAST_SENT_AT_UPDATED:
      return {
        ...state,
        lastSentAt: action.lastSentAt,
      };
    default:
      return state;
  }
};
export function getEmptyVaultReportState(): VaultReportState {
  return {
    lastSentAt: undefined,
  };
}
