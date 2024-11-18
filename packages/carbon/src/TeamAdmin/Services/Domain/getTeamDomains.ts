import { Domain, GetTeamDomainsResult } from "@dashlane/communication";
import {
  getCode,
  isApiError,
  listDomainErrors,
  listDomains,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { CoreServices } from "Services";
export async function getTeamDomains(
  services: CoreServices
): Promise<GetTeamDomainsResult> {
  const { storeService } = services;
  const login = userLoginSelector(storeService.getState());
  const result = await listDomains(storeService, login);
  if (isApiError(result)) {
    return {
      success: false,
      error: {
        code: getCode(result.code, listDomainErrors),
      },
    };
  }
  const sanitizedDomainData: Domain[] = result.domains.map((domain) => {
    return {
      id: domain.id,
      name: domain.domain,
      status: domain.status,
      dnsToken: domain.dnsToken,
      lastVerificationAttemptDateUnix: domain.lastVerificationAttemptDateUnix,
    };
  });
  return {
    success: true,
    domains: sanitizedDomainData,
  };
}
