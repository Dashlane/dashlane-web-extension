import {
  RegisterTeamDomainRequest,
  RegisterTeamDomainResult,
} from "@dashlane/communication";
import {
  getCode,
  isApiError,
  requestDomainRegistration,
  requestDomainRegistrationErrors,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { CoreServices } from "Services";
export async function registerTeamDomain(
  services: CoreServices,
  domain: RegisterTeamDomainRequest
): Promise<RegisterTeamDomainResult> {
  const { storeService } = services;
  const login = userLoginSelector(storeService.getState());
  const result = await requestDomainRegistration(storeService, login, domain);
  if (isApiError(result)) {
    return {
      success: false,
      error: {
        code: getCode(result.code, requestDomainRegistrationErrors),
      },
    };
  }
  return {
    success: true,
    data: {
      computedToken: result.computedToken,
      challengeDomain: result.challengeDomain,
    },
  };
}
