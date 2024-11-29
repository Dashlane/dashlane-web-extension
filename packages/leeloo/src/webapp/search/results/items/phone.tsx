import { VaultItemThumbnail } from "@dashlane/design-system";
import { ItemType } from "@dashlane/hermes";
import { Phone as Item } from "@dashlane/vault-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logSelectPersonalInfo } from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { getPhoneItemName } from "../../../personal-info/services";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import { useSearchContext } from "../../search-context";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
export const PhoneItem = ({
  item,
  index,
  matchCount,
}: SearchResultVaultItemProps) => {
  const phone = item as Item;
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const { closeSearch } = useSearchContext();
  const title = getPhoneItemName(phone, translate);
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectPersonalInfo(phone.id, ItemType.Phone, index + 1, matchCount);
    closeSearch();
    redirect(routes.userPersonalInfoPhone(phone.id));
  };
  return (
    <BaseResultItem
      id={phone.id}
      title={title}
      description={phone.phoneNumber}
      onClick={onClick}
      thumbnail={<VaultItemThumbnail type="phone-number" />}
    />
  );
};
