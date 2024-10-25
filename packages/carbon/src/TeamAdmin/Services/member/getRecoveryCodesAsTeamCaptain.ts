import {
  GetRecoveryCodesAsTeamCaptainErrorCode,
  GetRecoveryCodesAsTeamCaptainResult,
} from "@dashlane/communication";
import { isApiError } from "Libs/DashlaneApi";
import {
  getRecoveryCodesAsTeamCaptain as getRecoveryCodesAsTeamCaptainApi,
  GetRecoveryCodesAsTeamCaptainInternalErrorCode,
  GetRecoveryCodesAsTeamCaptainNotAdminErrorCode,
  GetRecoveryCodesAsTeamCaptainRequest,
  GetRecoveryCodesAsTeamCaptainResponse,
} from "Libs/DashlaneApi/services/teams/members/get-recovery-codes-as-team-captain";
import { CoreServices } from "Services";
import { userLoginSelector } from "Session/selectors";
const getRecoveryCodesAsTeamCaptainError = (
  response: GetRecoveryCodesAsTeamCaptainResponse
): GetRecoveryCodesAsTeamCaptainErrorCode => {
  switch (response.code) {
    case GetRecoveryCodesAsTeamCaptainNotAdminErrorCode:
      return GetRecoveryCodesAsTeamCaptainErrorCode.NotAdmin;
    case GetRecoveryCodesAsTeamCaptainInternalErrorCode:
      return GetRecoveryCodesAsTeamCaptainErrorCode.InternalError;
    default:
      return GetRecoveryCodesAsTeamCaptainErrorCode.UnknownError;
  }
};
export async function getRecoveryCodesAsTeamCaptain(
  services: CoreServices,
  params: GetRecoveryCodesAsTeamCaptainRequest
): Promise<GetRecoveryCodesAsTeamCaptainResult> {
  const { storeService } = services;
  const login = userLoginSelector(storeService.getState());
  const response = await getRecoveryCodesAsTeamCaptainApi(
    storeService,
    login,
    params
  );
  if (isApiError(response)) {
    return {
      success: false,
      error: {
        code: getRecoveryCodesAsTeamCaptainError(response),
      },
    };
  }
  return {
    success: true,
    data: { recoveryCodes: response.recoveryCodes },
  };
}
