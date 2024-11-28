import { memo } from "react";
import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { jsx } from "@dashlane/ui-components";
import { Identity, VaultItemType } from "@dashlane/vault-contracts";
import { parse as dateParser } from "date-fns";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
export interface Props {
  item: Identity;
}
export function parseDate(date: string): Date {
  if (!date) {
    return new Date();
  }
  const birthDateParsed = dateParser(date, "yyyy-MM-dd", new Date());
  return birthDateParsed.toString() !== "Invalid Date"
    ? birthDateParsed
    : new Date(date);
}
const IdentityComponent = ({ item }: Props) => {
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { id, spaceId, firstName, lastName, birthDate, birthPlace } = item;
  const { getLocaleMeta } = useTranslate();
  const openIdentityDetailView = () => {
    logSelectVaultItem(id, ItemType.Identity);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.Identity, id);
  };
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="name" />}
      itemSpaceId={spaceId}
      title={`${firstName} ${lastName.toUpperCase()}`}
      subtitle={`${Intl.DateTimeFormat(getLocaleMeta()?.code, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }).format(parseDate(birthDate))}, ${birthPlace}`}
      onClick={openIdentityDetailView}
    />
  );
};
export const IdentityListItem = memo(IdentityComponent);
