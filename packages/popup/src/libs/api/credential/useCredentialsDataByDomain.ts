import { useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { CredentialsByDomainDataQuery } from "@dashlane/communication";
import { carbonConnector } from "../../../carbonConnector";
export const useCredentialsDataByDomain = (domain: string) => {
  const queryParam: CredentialsByDomainDataQuery = {
    domain,
    sortToken: {
      sortCriteria: [
        {
          field: "lastUse",
          direction: "descend",
        },
      ],
      uniqField: "id",
    },
    filterToken: {
      filterCriteria: [],
    },
  };
  const liveParam = btoa(JSON.stringify(queryParam));
  return useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getCredentialsByDomain,
        queryParam,
      },
      liveConfig: {
        live: carbonConnector.liveCredentialsByDomain,
        liveParam,
      },
    },
    [domain]
  );
};
