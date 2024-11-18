import { useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi } from "@dashlane/vault-contracts";
import { getHeaderBackgroundColor } from "../../app/vault/detail-views/helpers";
const ICON_SIZE = "46x30@2x";
function getIconSource(domainIconDetailsUrls: Record<string, string>) {
  return ICON_SIZE in domainIconDetailsUrls
    ? domainIconDetailsUrls[ICON_SIZE]
    : "";
}
export const useDomainIconDetails = (domain: string) => {
  const { data: domainIconDetails } = useModuleQuery(
    vaultItemsCrudApi,
    "domainIconDetails",
    {
      domain,
    }
  );
  const iconSource = getIconSource(domainIconDetails?.urls ?? {});
  const backgroundColor = getHeaderBackgroundColor(
    domainIconDetails?.backgroundColor
  ).backgroundColor;
  return { domainIconDetails, iconSource, backgroundColor };
};
