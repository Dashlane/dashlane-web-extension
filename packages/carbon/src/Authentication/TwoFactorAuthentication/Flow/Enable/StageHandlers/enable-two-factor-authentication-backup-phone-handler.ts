import {
  BackupPhoneStageRequest,
  CountryCode,
  TwoFactorAuthenticationEnableStages,
  TwoFactorAuthenticationType,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  makeSafeCountry,
  RequestTOTPActivationSuccess,
} from "Libs/DashlaneApi";
import { updateStore } from "Authentication/TwoFactorAuthentication/Flow/Enable/helpers";
import { TwoFactorAuthenticationEnableFlowStoreState } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store";
import { getTwoFactorAuthenticationEnableFlowData } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/selectors";
import { requestTOTPActivationService } from "Authentication/TwoFactorAuthentication/services";
export const enableTwoFactorAuthenticationBackupPhoneHandler = async (
  coreServices: CoreServices,
  data: TwoFactorAuthenticationEnableFlowStoreState,
  flowStageRequest: BackupPhoneStageRequest
) => {
  const { storeService } = coreServices;
  let flowData = getTwoFactorAuthenticationEnableFlowData(
    storeService.getState()
  );
  const requestTOTPActivationResponse = await requestTOTPActivationService(
    coreServices,
    {
      ...flowStageRequest,
      country: makeSafeCountry(flowStageRequest.countryCode) as CountryCode,
    }
  );
  if (requestTOTPActivationResponse.success) {
    const { seed, uri, recoveryKeys, serverKey } =
      requestTOTPActivationResponse as RequestTOTPActivationSuccess;
    const { authenticationType } = flowData;
    if (authenticationType === TwoFactorAuthenticationType.LOGIN) {
      flowData[TwoFactorAuthenticationType.LOGIN].serverKey = serverKey;
    }
    flowData = { ...flowData, seed, uri, recoveryKeys };
    updateStore(coreServices, {
      ...data,
      stageData: { ...requestTOTPActivationResponse },
      flowData: {
        ...flowData,
        savedValues: {
          ...flowData?.savedValues,
          savedCountryCode: flowStageRequest.countryCode,
          savedPhoneNumber: flowStageRequest.phoneNumber,
        },
      },
      stage: TwoFactorAuthenticationEnableStages.QR_CODE,
    });
  } else {
    updateStore(coreServices, {
      ...data,
      stageData: { ...requestTOTPActivationResponse },
    });
  }
  return Promise.resolve({ success: true });
};
