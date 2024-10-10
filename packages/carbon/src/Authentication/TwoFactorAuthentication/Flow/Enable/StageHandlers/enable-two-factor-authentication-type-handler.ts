import {
  TwoFactorAuthenticationEnableStages,
  TwoFactorAuthenticationTypeStageRequest,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { waitUntilSyncComplete } from "User/Services/wait-until-sync-complete";
import {
  TwoFactorAuthenticationEnableFlowStoreState,
  updateTwoFactorAuthenticationStage,
} from "Authentication/TwoFactorAuthentication/Flow/Enable/Store";
import { getTwoFactorAuthenticationEnableFlowData } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/selectors";
import { updateStore } from "Authentication/TwoFactorAuthentication/Flow/Enable/helpers";
import {
  changeMPDone,
  changeMPStart,
} from "Session/Store/changeMasterPassword/actions";
import { userLoginSelector } from "Session/selectors";
import { getDataForMasterPasswordChange, isApiError } from "Libs/DashlaneApi";
import { logChangeMasterPasswordError } from "ChangeMasterPassword/logs";
import { ChangeMasterPasswordError } from "@dashlane/hermes";
import { TwoFactorAuthenticationType } from "@dashlane/communication";
export const enableTwoFactorAuthenticationTypeHandler = async (
  coreServices: CoreServices,
  data: TwoFactorAuthenticationEnableFlowStoreState,
  { authenticationType }: TwoFactorAuthenticationTypeStageRequest
) => {
  const { storeService } = coreServices;
  const flowData = getTwoFactorAuthenticationEnableFlowData(
    storeService.getState()
  );
  if (authenticationType === TwoFactorAuthenticationType.LOGIN) {
    try {
      const actionLoading = updateTwoFactorAuthenticationStage({
        ...data,
        stage: TwoFactorAuthenticationEnableStages.LOADING,
      });
      storeService.dispatch(actionLoading);
      const { eventLoggerService } = coreServices;
      const state = storeService.getState();
      const login = userLoginSelector(state);
      if (!login) {
        updateStore(coreServices, {
          ...data,
          stage: TwoFactorAuthenticationEnableStages.GENERIC_ERROR,
        });
        return Promise.resolve({ success: false });
      }
      const syncCompleted = await waitUntilSyncComplete(storeService);
      if (!syncCompleted) {
        updateStore(coreServices, {
          ...data,
          stage: TwoFactorAuthenticationEnableStages.GENERIC_ERROR,
        });
        return Promise.resolve({ success: false });
      }
      storeService.dispatch(changeMPStart());
      const response = await getDataForMasterPasswordChange(
        storeService,
        login,
        {}
      );
      if (isApiError(response)) {
        logChangeMasterPasswordError(
          eventLoggerService,
          ChangeMasterPasswordError.DownloadError
        );
        storeService.dispatch(changeMPDone());
        updateStore(coreServices, {
          ...data,
          stage: TwoFactorAuthenticationEnableStages.GENERIC_ERROR,
        });
      } else {
        const {
          data: { transactions, sharingKeys },
          timestamp,
        } = response;
        const action = updateTwoFactorAuthenticationStage({
          ...data,
          flowData: {
            ...flowData,
            authenticationType,
            [TwoFactorAuthenticationType.LOGIN]: {
              transactions,
              sharingKeys,
              timestamp,
              serverKey: "",
            },
            savedValues: {
              ...flowData?.savedValues,
              savedAuthenticationType: authenticationType,
            },
          },
          stage: TwoFactorAuthenticationEnableStages.BACKUP_PHONE,
        });
        storeService.dispatch(action);
      }
    } catch (error) {
      storeService.dispatch(changeMPDone());
      updateStore(coreServices, {
        ...data,
        stage: TwoFactorAuthenticationEnableStages.GENERIC_ERROR,
      });
    }
  } else {
    const action = updateTwoFactorAuthenticationStage({
      ...data,
      flowData: {
        ...flowData,
        authenticationType,
        savedValues: {
          ...flowData?.savedValues,
          savedAuthenticationType: authenticationType,
        },
      },
      stage: TwoFactorAuthenticationEnableStages.BACKUP_PHONE,
    });
    storeService.dispatch(action);
  }
  return Promise.resolve({ success: true });
};
