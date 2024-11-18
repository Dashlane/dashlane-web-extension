import {
  AuthenticationCode,
  GetTeamInfoError,
  GetTeamInfoResult,
} from "@dashlane/communication";
import {
  ApiError,
  isApiError,
  NotAdmin,
  teamStatus,
  TeamStatusError,
} from "Libs/DashlaneApi";
import { CoreServices } from "Services";
import { userLoginSelector } from "Session/selectors";
export async function getTeamInfo(
  services: CoreServices
): Promise<GetTeamInfoResult> {
  const { storeService } = services;
  const login = userLoginSelector(storeService.getState());
  const response = await teamStatus(storeService, login);
  if (isApiError(response)) {
    return formatError(response);
  }
  const { billing, seats, info, planTier, capabilities } = response;
  return {
    success: true,
    data: {
      billing,
      teamInfo: info,
      planTier,
      capabilities,
      seats,
    },
  };
}
const formatError = (error: ApiError<TeamStatusError>) => {
  switch (error.code) {
    case NotAdmin:
      return makeReturnErrorObject(
        AuthenticationCode.UNAUTHORIZED,
        error.message
      );
    default:
      return makeReturnErrorObject(
        AuthenticationCode.UNKNOWN_ERROR,
        error.message
      );
  }
};
const makeReturnErrorObject = (
  reason: AuthenticationCode,
  message: string
): GetTeamInfoError => {
  return {
    success: false,
    reason,
    message,
  };
};
