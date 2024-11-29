import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { Identity as Item } from "@dashlane/vault-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logSelectPersonalInfo } from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import {
  getIdentityItemFullName,
  getViewedIdentitySecondLine,
} from "../../../personal-info/services";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import { useSearchContext } from "../../search-context";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
export const IdentityItem = ({
  item,
  index,
  matchCount,
}: SearchResultVaultItemProps) => {
  const identity = item as Item;
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const { closeSearch } = useSearchContext();
  const title = getIdentityItemFullName(identity);
  const description = getViewedIdentitySecondLine(
    identity.birthDate,
    identity.birthPlace,
    translate
  );
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectPersonalInfo(
      identity.id,
      ItemType.Identity,
      index + 1,
      matchCount
    );
    closeSearch();
    redirect(routes.userPersonalInfoIdentity(identity.id));
  };
  return (
    <BaseResultItem
      id={identity.id}
      title={title}
      description={description}
      onClick={onClick}
      thumbnail={<VaultItemThumbnail type="id-card" />}
    />
  );
};
