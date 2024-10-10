import { TwoFactorAuthenticationEnableStages } from "@dashlane/communication";
import {
  StageHandler,
  StoreMapper,
  ViewMapper,
} from "Authentication/TwoFactorAuthentication/Flow/Enable/types";
import {
  endTwoFactorAuthenticationEnableStoreMapper,
  startTwoFactorAuthenticationEnableStoreMapper,
} from "Authentication/TwoFactorAuthentication/Flow/Enable/store-mappers";
import {
  enableTwoFactorAuthenticationBackupCodesViewMapper,
  enableTwoFactorAuthenticationBackupPhoneViewMapper,
  enableTwoFactorAuthenticationCodeViewMapper,
  enableTwoFactorAuthenticationQRCodeViewMapper,
  enableTwoFactorAuthenticationTypeViewMapper,
} from "Authentication/TwoFactorAuthentication/Flow/Enable/view-mappers";
import {
  enableTwoFactorAuthenticationBackupCodesHandler,
  enableTwoFactorAuthenticationBackupPhoneHandler,
  enableTwoFactorAuthenticationCodeHandler,
  enableTwoFactorAuthenticationLogoutRequiredHandler,
  enableTwoFactorAuthenticationTypeHandler,
} from "Authentication/TwoFactorAuthentication/Flow/Enable/StageHandlers";
import { endTwoFactorAuthenticationHandler } from "Authentication/TwoFactorAuthentication/handlers";
export type TwoFactorAuthenticationEnableFlowStageConfig = {
  currentHandler?: StageHandler;
  backHandler?: StageHandler;
  storeMapper?: StoreMapper;
  viewMapper?: ViewMapper;
};
export const TwoFactorAuthenticationEnableFlowConfig: Record<
  string,
  TwoFactorAuthenticationEnableFlowStageConfig
> = {
  start: {
    storeMapper: startTwoFactorAuthenticationEnableStoreMapper,
  },
  stop: {
    currentHandler: endTwoFactorAuthenticationHandler,
    storeMapper: endTwoFactorAuthenticationEnableStoreMapper,
  },
  end: {
    currentHandler: endTwoFactorAuthenticationHandler,
    storeMapper: endTwoFactorAuthenticationEnableStoreMapper,
  },
  [TwoFactorAuthenticationEnableStages.AUTHENTICATION_TYPE]: {
    currentHandler: enableTwoFactorAuthenticationTypeHandler,
    viewMapper: enableTwoFactorAuthenticationTypeViewMapper,
  },
  [TwoFactorAuthenticationEnableStages.BACKUP_PHONE]: {
    currentHandler: enableTwoFactorAuthenticationBackupPhoneHandler,
    viewMapper: enableTwoFactorAuthenticationBackupPhoneViewMapper,
  },
  [TwoFactorAuthenticationEnableStages.QR_CODE]: {
    viewMapper: enableTwoFactorAuthenticationQRCodeViewMapper,
  },
  [TwoFactorAuthenticationEnableStages.AUTHENTICATION_CODE]: {
    currentHandler: enableTwoFactorAuthenticationCodeHandler,
    viewMapper: enableTwoFactorAuthenticationCodeViewMapper,
  },
  [TwoFactorAuthenticationEnableStages.BACKUP_CODES]: {
    currentHandler: enableTwoFactorAuthenticationBackupCodesHandler,
    viewMapper: enableTwoFactorAuthenticationBackupCodesViewMapper,
  },
  [TwoFactorAuthenticationEnableStages.LOGOUT_REQUIRED]: {
    currentHandler: enableTwoFactorAuthenticationLogoutRequiredHandler,
  },
};
type TwoFactorAuthenticationEnableStageType = {
  stage: string;
};
export const TwoFactorAuthenticationEnableFlowStages: TwoFactorAuthenticationEnableStageType[] =
  [
    { stage: TwoFactorAuthenticationEnableStages.AUTHENTICATION_TYPE },
    { stage: TwoFactorAuthenticationEnableStages.BACKUP_PHONE },
    { stage: TwoFactorAuthenticationEnableStages.QR_CODE },
    { stage: TwoFactorAuthenticationEnableStages.AUTHENTICATION_CODE },
    { stage: TwoFactorAuthenticationEnableStages.FINALIZING_CHANGES },
    { stage: TwoFactorAuthenticationEnableStages.BACKUP_CODES },
    { stage: TwoFactorAuthenticationEnableStages.SUCCESS },
  ];
