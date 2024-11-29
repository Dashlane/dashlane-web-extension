import { autofillSettingsApi } from "@dashlane/autofill-contracts";
import { Button, IconProps } from "@dashlane/design-system";
import {
  ConnectedDomainThumbnail,
  useModuleQueries,
  useModuleQuery,
} from "@dashlane/framework-react";
import { sharingItemsApi } from "@dashlane/sharing-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import {
  Credential as Item,
  vaultItemsCrudApi,
} from "@dashlane/vault-contracts";
import { openUrl } from "../../../../libs/external-urls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useAreRichIconsEnabled } from "../../../../libs/hooks/use-are-rich-icons-enabled";
import { logOpenCredentialUrl } from "../../../../libs/logs/events/vault/open-external-vault-item-link";
import { logSelectCredential } from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { useIsAllowedToShare } from "../../../../libs/hooks/use-is-allowed-to-share";
import { useIsB2CUserFrozen } from "../../../../libs/frozen-state/hooks/use-is-b2c-user-frozen";
import { QuickActionsMenu } from "../../../credentials/quick-actions-menu/quick-actions-menu";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import { useSearchContext } from "../../search-context";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
const I18N_KEYS = {
  GO_TO_WEBSITE_TOOLTIP_NO_WEBSITE: "webapp_sidemenu_search_actions_no_website",
  GO_TO_WEBSITE_TOOLTIP_TITLE: "webapp_sidemenu_search_actions_goto_title",
  MORE_TITLE: "webapp_sidemenu_search_actions_more_title",
};
export const CredentialItem = ({
  item,
  index,
  matchCount,
}: SearchResultVaultItemProps) => {
  const credential = item as Item;
  const areRichIconsEnabled = useAreRichIconsEnabled();
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const { closeSearch } = useSearchContext();
  const { data: isCredentialsGloballyProtected } = useModuleQuery(
    vaultItemsCrudApi,
    "credentialsGloballyProtected"
  );
  const { data: credentialPreferences } = useModuleQuery(
    autofillSettingsApi,
    "getPreferencesForCredentials",
    {
      credentialIds: [credential.id],
    }
  );
  const isAllowedToShare = useIsAllowedToShare();
  const {
    getPermissionForItem: getPermissionForItemResult,
    sharingEnabled: sharingEnabledResult,
    getSharingStatusForItem: sharingStatus,
  } = useModuleQueries(
    sharingItemsApi,
    {
      getPermissionForItem: {
        queryParam: {
          itemId: credential.id,
        },
      },
      sharingEnabled: {},
      getSharingStatusForItem: {
        queryParam: { itemId: credential.id },
      },
    },
    []
  );
  const isUserFrozen = useIsB2CUserFrozen();
  const handleOnOpenWebsite = () => {
    void logOpenCredentialUrl(credential.id, credential.URL);
    openUrl(credential.URL);
  };
  const thumbnailUrl = new ParsedURL(credential.URL).getRootDomain();
  const icons: Record<
    string,
    {
      condition: boolean;
      icon: IconProps["name"];
    }
  > = {
    shared: {
      icon: "SharedOutlined",
      condition: !!sharingStatus.data?.isShared,
    },
    autoProtected: {
      icon: "LockOutlined",
      condition: !!credentialPreferences?.[0]?.requireMasterPassword,
    },
  };
  const iconsShown = Object.values(icons)
    .filter(({ condition }) => condition)
    .map(({ icon }) => icon);
  const label = translate(
    credential.URL
      ? I18N_KEYS.GO_TO_WEBSITE_TOOLTIP_TITLE
      : I18N_KEYS.GO_TO_WEBSITE_TOOLTIP_NO_WEBSITE
  );
  const route = routes.userCredential(credential.id);
  if (
    credentialPreferences === undefined ||
    sharingEnabledResult.data === undefined ||
    isCredentialsGloballyProtected === undefined ||
    isUserFrozen === null
  ) {
    return null;
  }
  const actions = (
    <div sx={{ display: "flex", flexDirection: "row", gap: "8px" }}>
      <Button
        mood="brand"
        intensity="supershy"
        layout="iconOnly"
        size="small"
        icon="ActionOpenExternalLinkOutlined"
        onClick={handleOnOpenWebsite}
        disabled={!credential.URL}
        aria-label={label}
        tooltip={label}
      />
      <QuickActionsMenu
        credential={credential}
        credentialItemRoute={route}
        credentialPreferences={credentialPreferences?.[0]}
        permission={getPermissionForItemResult?.data?.permission}
        isSharingAllowed={isAllowedToShare}
        isSharingEnabled={sharingEnabledResult.data}
        isUserFrozen={isUserFrozen}
        isCredentialsGloballyProtected={isCredentialsGloballyProtected}
        searchEmbedded={true}
        triggerButton={{
          showCaret: false,
          mood: "brand",
          intensity: "supershy",
          layout: "iconOnly",
          icon: "ActionMoreOutlined",
          size: "small",
          "aria-label": translate(I18N_KEYS.MORE_TITLE),
        }}
      />
    </div>
  );
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectCredential(credential.id, index + 1, matchCount);
    closeSearch();
    redirect(route);
  };
  return (
    <BaseResultItem
      id={credential.id}
      title={credential.itemName}
      description={credential.username || credential.email}
      onClick={onClick}
      thumbnail={
        <ConnectedDomainThumbnail
          domainURL={thumbnailUrl}
          forceFallback={!areRichIconsEnabled}
        />
      }
      icons={iconsShown}
      actions={actions}
    />
  );
};
