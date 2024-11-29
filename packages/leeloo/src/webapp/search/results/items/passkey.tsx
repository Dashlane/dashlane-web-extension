import { ConnectedDomainThumbnail } from "@dashlane/framework-react";
import { Passkey as Item } from "@dashlane/vault-contracts";
import { logSelectPasskey } from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import { useSearchContext } from "../../search-context";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
import { useAreRichIconsEnabled } from "../../../../libs/hooks/use-are-rich-icons-enabled";
export const PasskeyItem = ({
  item,
  index,
  matchCount,
}: SearchResultVaultItemProps) => {
  const passkey = item as Item;
  const areRichIconsEnabled = useAreRichIconsEnabled();
  const { routes } = useRouterGlobalSettingsContext();
  const { closeSearch } = useSearchContext();
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectPasskey(passkey.id, index + 1, matchCount);
    closeSearch();
    redirect(routes.userPasskey(passkey.id));
  };
  return (
    <BaseResultItem
      id={passkey.id}
      title={passkey.itemName ?? passkey.rpName}
      description={passkey.userDisplayName}
      onClick={onClick}
      thumbnail={
        <ConnectedDomainThumbnail
          domainURL={passkey.rpId}
          forceFallback={!areRichIconsEnabled}
        />
      }
      icons={["PasskeyOutlined"]}
    />
  );
};
