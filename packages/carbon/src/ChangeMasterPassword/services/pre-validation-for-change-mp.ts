import {
  ChangeMasterPasswordBase,
  ChangeMasterPasswordCode,
  ChangeMasterPasswordError,
  ChangeMasterPasswordParams,
  ChangeMPFlowPath,
  MigrationToEmailToken,
  MigrationWithAccountRecoveryKey,
  MigrationWithAdminAssistedRecovery,
} from "@dashlane/communication";
import { CHANGEMP_WEB_BLOCKED_FEATURE_FLIP } from "ChangeMasterPassword/types";
import { waitUntilSyncComplete } from "User/Services/wait-until-sync-complete";
import { evaluatePasswordStrengthOutOfFive } from "Health/Strength/evaluatePasswordStrengthOutOfFive";
import { CoreServices } from "Services";
import {
  authTicketInfoSelector,
  isRemoteKeyActivatedSelector,
  userLoginSelector,
} from "Session/selectors";
import { recoveryDataSelector } from "Session/recovery.selectors";
import { makeFeatureFlipsSelectors } from "Feature/selectors";
import { makeReturnErrorObject } from "ChangeMasterPassword/services";
import { State } from "Store";
import { validateMasterPassword } from "Session/performValidation";
import { minAcceptablePasswordStrength } from "carbon-constants";
export const extractCurrentPassword = (
  state: State,
  params:
    | ChangeMasterPasswordBase
    | MigrationWithAdminAssistedRecovery
    | MigrationToEmailToken
    | MigrationWithAccountRecoveryKey
): string => {
  if (params.flow === ChangeMPFlowPath.ADMIN_ASSISTED_RECOVERY) {
    return recoveryDataSelector(state).currentPassword;
  }
  return params.currentPassword;
};
type preValidationForChangeMP =
  | ChangeMasterPasswordError
  | {
      success: true;
    };
export const preValidationForChangeMP = async (
  services: CoreServices,
  params: ChangeMasterPasswordParams
): Promise<preValidationForChangeMP> => {
  const {
    applicationModulesAccess,
    masterPasswordEncryptorService,
    storeService,
  } = services;
  const { newPassword, flow } = params;
  const syncCompleted = await waitUntilSyncComplete(storeService);
  if (!syncCompleted) {
    return makeReturnErrorObject(ChangeMasterPasswordCode.SYNC_PROGRESS, flow);
  }
  const state = storeService.getState();
  const features = await makeFeatureFlipsSelectors(
    applicationModulesAccess
  ).featureFlipsSelector();
  if (!storeService.getAccountInfo().isAuthenticated) {
    return makeReturnErrorObject(
      ChangeMasterPasswordCode.INNACTIVE_SESSION,
      flow
    );
  }
  if (features[CHANGEMP_WEB_BLOCKED_FEATURE_FLIP]) {
    return makeReturnErrorObject(
      ChangeMasterPasswordCode.FEATURE_BLOCKED,
      flow
    );
  }
  const strength = await evaluatePasswordStrengthOutOfFive(newPassword);
  if (!newPassword || !strength || strength < minAcceptablePasswordStrength) {
    return makeReturnErrorObject(
      ChangeMasterPasswordCode.MP_STRENGTH_ERROR,
      flow
    );
  }
  const isRemoteKeyInitiallyActivated = isRemoteKeyActivatedSelector(state);
  const timoutMs = 15 * 60 * 1000;
  const { authTicket, date } = authTicketInfoSelector(state);
  if (!userLoginSelector(state)) {
    return makeReturnErrorObject(
      ChangeMasterPasswordCode.UNEXPECTED_STATE,
      flow
    );
  }
  switch (params.flow) {
    case ChangeMPFlowPath.MP_TO_SSO:
      if (!authTicket || !date || Date.now() - date > timoutMs) {
        return makeReturnErrorObject(
          ChangeMasterPasswordCode.INVALID_TOKEN,
          flow
        );
      }
      if (isRemoteKeyInitiallyActivated) {
        return makeReturnErrorObject(
          ChangeMasterPasswordCode.UNEXPECTED_STATE,
          flow
        );
      }
      break;
    case ChangeMPFlowPath.SSO_TO_MP:
      if (!authTicket || !date || Date.now() - date > timoutMs) {
        return makeReturnErrorObject(
          ChangeMasterPasswordCode.INVALID_TOKEN,
          flow
        );
      }
      if (!isRemoteKeyInitiallyActivated) {
        return makeReturnErrorObject(
          ChangeMasterPasswordCode.UNEXPECTED_STATE,
          flow
        );
      }
      break;
    case ChangeMPFlowPath.ADMIN_ASSISTED_RECOVERY:
      break;
    case ChangeMPFlowPath.TO_EMAIL_TOKEN:
    case ChangeMPFlowPath.USER_CHANGING_MP:
    case ChangeMPFlowPath.ACCOUNT_RECOVERY_KEY:
      {
        const { currentPassword } = params;
        if (
          flow !== ChangeMPFlowPath.ACCOUNT_RECOVERY_KEY &&
          currentPassword === newPassword
        ) {
          return makeReturnErrorObject(ChangeMasterPasswordCode.MP_ERROR, flow);
        }
        const isMasterPasswordValid = await validateMasterPassword(
          storeService,
          masterPasswordEncryptorService,
          currentPassword
        );
        if (!isMasterPasswordValid) {
          return makeReturnErrorObject(
            ChangeMasterPasswordCode.WRONG_PASSWORD,
            flow
          );
        }
      }
      break;
    default:
      return makeReturnErrorObject(
        ChangeMasterPasswordCode.UNEXPECTED_STATE,
        flow
      );
  }
  return { success: true };
};
