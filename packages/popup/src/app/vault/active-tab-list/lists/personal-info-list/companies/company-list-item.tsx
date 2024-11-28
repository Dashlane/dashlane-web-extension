import { memo } from "react";
import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { jsx } from "@dashlane/ui-components";
import { Company, VaultItemType } from "@dashlane/vault-contracts";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
export interface CompanyProps {
  item: Company;
}
const CompanyComponent = ({ item }: CompanyProps) => {
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { id, spaceId, companyName, jobTitle } = item;
  const openCompanyDetailView = () => {
    logSelectVaultItem(id, ItemType.Company);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.Company, id);
  };
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="company" />}
      itemSpaceId={spaceId}
      title={companyName}
      subtitle={jobTitle}
      onClick={openCompanyDetailView}
    />
  );
};
export const CompanyListItem = memo(CompanyComponent);
