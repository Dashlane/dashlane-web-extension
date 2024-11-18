import {
  CompleteTeamDomainResult,
  DomainVerification,
} from "@dashlane/communication";
import {
  completeDomainRegistration,
  completeDomainRegistrationErrors,
  getCode,
  isApiError,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { CoreServices } from "Services";
export async function completeTeamDomainRegistration(
  services: CoreServices
): Promise<CompleteTeamDomainResult> {
  const { storeService } = services;
  const login = userLoginSelector(storeService.getState());
  const result = await completeDomainRegistration(storeService, login);
  if (isApiError(result)) {
    return {
      success: false,
      error: {
        code: getCode(result.code, completeDomainRegistrationErrors),
      },
    };
  }
  const sanitizedDomainData: DomainVerification[] = result.domain.map(
    (domain) => {
      return {
        name: domain.domain,
        status: domain.status,
      };
    }
  );
  return {
    success: true,
    domains: sanitizedDomainData,
  };
}
