import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { Email as Item } from "@dashlane/vault-contracts";
import { logSelectPersonalInfo } from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import { useSearchContext } from "../../search-context";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
export const EmailItem = ({
  item,
  index,
  matchCount,
}: SearchResultVaultItemProps) => {
  const email = item as Item;
  const { routes } = useRouterGlobalSettingsContext();
  const { closeSearch } = useSearchContext();
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectPersonalInfo(email.id, ItemType.Email, index + 1, matchCount);
    closeSearch();
    redirect(routes.userPersonalInfoEmail(email.id));
  };
  return (
    <BaseResultItem
      id={email.id}
      title={email.itemName}
      description={email.emailAddress}
      onClick={onClick}
      thumbnail={<VaultItemThumbnail type="email" />}
    />
  );
};
