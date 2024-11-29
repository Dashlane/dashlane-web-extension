import { VaultItemThumbnail } from "@dashlane/design-system";
import {
  DriversLicense,
  FiscalId,
  IdCard,
  IdVaultItemType,
  Passport,
  SocialSecurityId,
} from "@dashlane/vault-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  idToItemType,
  logSelectId,
} from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { QuickActions } from "../../../ids/quick-actions/quick-actions";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import { useSearchContext } from "../../search-context";
import { getIdDocumentData } from "../helpers/get-id-document-data";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
type IdVaultItem =
  | DriversLicense
  | FiscalId
  | IdCard
  | Passport
  | SocialSecurityId;
interface IdDocumentItemProps extends SearchResultVaultItemProps {
  item: IdVaultItem;
}
export const IdDocumentItem = ({
  item,
  index,
  matchCount,
}: IdDocumentItemProps) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const { closeSearch } = useSearchContext();
  const type = item.kwType as IdVaultItemType;
  const { title, description, thumbnail } = getIdDocumentData(
    type,
    item,
    translate
  );
  const route = routes.userEditIdDocument(type, item.id);
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectId(item.id, idToItemType[type], index + 1, matchCount);
    closeSearch();
    redirect(route);
  };
  const actions = (
    <QuickActions
      itemId={item.id}
      copyValue={item["idNumber"] || item["fiscalNumber"]}
      editRoute={route}
      variant="search"
      type={type}
    />
  );
  return (
    <BaseResultItem
      id={item.id}
      title={title}
      description={description}
      onClick={onClick}
      thumbnail={<VaultItemThumbnail type={thumbnail} />}
      actions={actions}
    />
  );
};
