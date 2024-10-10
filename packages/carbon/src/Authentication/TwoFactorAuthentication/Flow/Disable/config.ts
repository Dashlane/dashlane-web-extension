import { TwoFactorAuthenticationDisableStages } from "@dashlane/communication";
import {
  StageHandler,
  StoreMapper,
  ViewMapper,
} from "Authentication/TwoFactorAuthentication/Flow/Disable/types";
import {
  endTwoFactorAuthenticationDisableStoreMapper,
  startTwoFactorAuthenticationDisableStoreMapper,
} from "Authentication/TwoFactorAuthentication/Flow/Disable/store-mappers";
import {
  disableTwoFactorAuthenticationCodeHandler,
  disableTwoFactorAuthenticationLogoutRequiredHandler,
} from "Authentication/TwoFactorAuthentication/Flow/Disable/stage-handlers";
import {
  disableTwoFactorAuthenticationBackupCodeViewMapper,
  disableTwoFactorAuthenticationCodeViewMapper,
} from "Authentication/TwoFactorAuthentication/Flow/Disable/view-mappers";
import { endTwoFactorAuthenticationHandler } from "Authentication/TwoFactorAuthentication/handlers";
export type TwoFactorAuthenticationDisableFlowStageConfig = {
  currentHandler?: StageHandler;
  backHandler?: StageHandler;
  storeMapper?: StoreMapper;
  viewMapper?: ViewMapper;
};
export const TwoFactorAuthenticationDisableFlowConfig: Record<
  string,
  TwoFactorAuthenticationDisableFlowStageConfig
> = {
  start: {
    storeMapper: startTwoFactorAuthenticationDisableStoreMapper,
  },
  stop: {
    currentHandler: endTwoFactorAuthenticationHandler,
    storeMapper: endTwoFactorAuthenticationDisableStoreMapper,
  },
  end: {
    currentHandler: endTwoFactorAuthenticationHandler,
    storeMapper: endTwoFactorAuthenticationDisableStoreMapper,
  },
  [TwoFactorAuthenticationDisableStages.AUTHENTICATION_CODE]: {
    currentHandler: disableTwoFactorAuthenticationCodeHandler,
    viewMapper: disableTwoFactorAuthenticationCodeViewMapper,
  },
  [TwoFactorAuthenticationDisableStages.BACKUP_CODE]: {
    currentHandler: disableTwoFactorAuthenticationCodeHandler,
    viewMapper: disableTwoFactorAuthenticationBackupCodeViewMapper,
  },
  [TwoFactorAuthenticationDisableStages.LOGOUT_REQUIRED]: {
    currentHandler: disableTwoFactorAuthenticationLogoutRequiredHandler,
  },
};
type TwoFactorAuthenticationDisableStageType = {
  stage: string;
};
export const TwoFactorAuthenticationDisableFlowStages: TwoFactorAuthenticationDisableStageType[] =
  [
    { stage: TwoFactorAuthenticationDisableStages.CONFIRMATION },
    { stage: TwoFactorAuthenticationDisableStages.AUTHENTICATION_CODE },
    { stage: TwoFactorAuthenticationDisableStages.FINALIZING_CHANGES },
    { stage: TwoFactorAuthenticationDisableStages.SUCCESS },
  ];
