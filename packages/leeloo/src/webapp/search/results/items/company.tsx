import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { Company as Item } from "@dashlane/vault-contracts";
import { logSelectPersonalInfo } from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import { useSearchContext } from "../../search-context";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
export const CompanyItem = ({
  item,
  index,
  matchCount,
}: SearchResultVaultItemProps) => {
  const company = item as Item;
  const { routes } = useRouterGlobalSettingsContext();
  const { closeSearch } = useSearchContext();
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectPersonalInfo(company.id, ItemType.Company, index + 1, matchCount);
    closeSearch();
    redirect(routes.userPersonalInfoCompany(company.id));
  };
  return (
    <BaseResultItem
      id={company.id}
      title={company.companyName}
      description={company.jobTitle}
      onClick={onClick}
      thumbnail={<VaultItemThumbnail type="company" />}
    />
  );
};
