import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { RecoveryCommands } from "Recovery/Api/commands";
import { RecoveryQueries } from "Recovery/Api/queries";
import { RecoveryLiveQueries } from "Recovery/Api/live-queries";
import { accountRecoveryRequestsCountSelector } from "Recovery/selectors";
import {
  activateAccountRecovery,
  deactivateAccountRecovery,
  isRecoveryRequestPending,
} from "Recovery/services/recovery-setup";
import {
  cancelRecoveryRequest,
  checkDoesLocalRecoveryKeyExist,
  checkRecoveryRequestStatus,
  recoverUserData,
  registerDeviceForRecovery,
  sendRecoveryRequest,
  setupMasterPasswordForRecovery,
  startAccountRecovery,
} from "Recovery/services/recovery-flow";
import { accountRecoveryOptInSelector } from "Session/selectors";
import { accountRecoveryRequestsCount$ } from "Recovery/live";
export const config: CommandQueryBusConfig<
  RecoveryCommands,
  RecoveryQueries,
  RecoveryLiveQueries
> = {
  commands: {
    activateAccountRecovery: { handler: activateAccountRecovery },
    setupMasterPasswordForRecovery: {
      handler: setupMasterPasswordForRecovery,
    },
    deactivateAccountRecovery: { handler: deactivateAccountRecovery },
    registerDeviceForRecovery: { handler: registerDeviceForRecovery },
    startAccountRecovery: {
      handler: startAccountRecovery,
    },
    sendRecoveryRequest: { handler: sendRecoveryRequest },
    cancelRecoveryRequest: { handler: cancelRecoveryRequest },
    checkRecoveryRequestStatus: { handler: checkRecoveryRequestStatus },
    recoverUserData: { handler: recoverUserData },
    checkDoesLocalRecoveryKeyExist: {
      handler: checkDoesLocalRecoveryKeyExist,
    },
    isRecoveryRequestPending: { handler: isRecoveryRequestPending },
  },
  queries: {
    getRecoveryOptInSetting: { selector: accountRecoveryOptInSelector },
    getAccountRecoveryRequestCount: {
      selector: accountRecoveryRequestsCountSelector,
    },
  },
  liveQueries: {
    liveAccountRecoveryRequestCount: {
      operator: accountRecoveryRequestsCount$,
    },
  },
};
