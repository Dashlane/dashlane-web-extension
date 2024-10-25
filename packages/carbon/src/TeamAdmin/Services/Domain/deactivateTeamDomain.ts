import {
  DeactivateTeamDomainRequest,
  DeactivateTeamDomainResult,
} from "@dashlane/communication";
import {
  deactivateDomain,
  deactivateDomainErrors,
  getCode,
  isApiError,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { CoreServices } from "Services";
export async function deactivateTeamDomain(
  services: CoreServices,
  domain: DeactivateTeamDomainRequest
): Promise<DeactivateTeamDomainResult> {
  const { storeService } = services;
  const login = userLoginSelector(storeService.getState());
  const result = await deactivateDomain(storeService, login, domain);
  if (isApiError(result)) {
    return {
      success: false,
      error: {
        code: getCode(result.code, deactivateDomainErrors),
      },
    };
  }
  return {
    success: true,
  };
}
