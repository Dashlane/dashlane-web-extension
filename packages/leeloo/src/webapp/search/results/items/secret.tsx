import { VaultItemThumbnail } from "@dashlane/design-system";
import { Secret as Item } from "@dashlane/vault-contracts";
import { logSelectSecret } from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import {
  UnlockerAction,
  useProtectedItemsUnlocker,
} from "../../../unlock-items";
import { LockedItemType } from "../../../unlock-items/types";
import { useSearchContext } from "../../search-context";
import { getNoteDescription } from "../helpers/get-note-description";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
export const SecretItem = ({
  item,
  index,
  matchCount,
}: SearchResultVaultItemProps) => {
  const secret = item as Item;
  const { routes } = useRouterGlobalSettingsContext();
  const { closeSearch } = useSearchContext();
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const description = getNoteDescription(secret.isSecured, secret.content);
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectSecret(secret.id, index + 1, matchCount);
    closeSearch();
    const successCallback = () => {
      redirect(routes.userSecret(secret.id));
    };
    const isSecretLocked = secret.isSecured && !areProtectedItemsUnlocked;
    if (isSecretLocked) {
      openProtectedItemsUnlocker({
        action: UnlockerAction.Show,
        itemType: LockedItemType.Secret,
        successCallback,
      });
    } else {
      successCallback();
    }
  };
  return (
    <BaseResultItem
      id={secret.id}
      title={secret.title}
      description={description}
      onClick={onClick}
      thumbnail={<VaultItemThumbnail type="secret" />}
    />
  );
};
