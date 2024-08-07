import {
  ListResults,
  PasskeyItemView,
  PasskeysForDomainDataQuery,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { AutofillEngineContext } from "../../../Api/server/context";
const queryForDomain = (
  fullDomain: string,
  searchValue?: string
): PasskeysForDomainDataQuery => {
  return {
    sortToken: {
      sortCriteria: [{ field: "lastUse", direction: "descend" }],
      uniqField: "rpId",
    },
    filterToken: {
      filterCriteria: searchValue
        ? [
            {
              type: "matches",
              value: searchValue,
            },
          ]
        : [],
    },
    domain: fullDomain,
  };
};
export function getAllPasskeysForThisDomainFromVault(
  context: AutofillEngineContext,
  url: string,
  searchValue?: string
): Promise<ListResults<PasskeyItemView>> {
  const fullDomain = new ParsedURL(url).getHostname();
  return context.connectors.carbon.getPasskeysForDomain(
    queryForDomain(fullDomain, searchValue)
  );
}
