import { memo } from "react";
import { Credential } from "@dashlane/vault-contracts";
import { CredentialPreferences } from "@dashlane/autofill-contracts";
import { Button, Tooltip } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { openUrl } from "../../../libs/external-urls";
import { logOpenCredentialUrl } from "../../../libs/logs/events/vault/open-external-vault-item-link";
import { QuickActionsMenu } from "../quick-actions-menu/quick-actions-menu";
import { useCredentialsContext } from "../credentials-view/credentials-context";
import { useSharingContext } from "../credentials-view/sharing-context";
interface ListRowActionsProps {
  credentialItemRoute: string;
  credential: Credential;
  credentialPreferences: CredentialPreferences;
  isUserFrozen: boolean;
}
const I18N_KEYS = {
  NO_WEBSITE_TOOLTIP: "webapp_credentials_row_no_website_tooltip",
  OPEN_WEBSITE: "webapp_credentials_row_open_website",
  ACTIONS_MENU: "webapp_credentials_row_accessibility_actions_menu",
};
const ListRowActionsComponent = ({
  credentialItemRoute,
  credential,
  credentialPreferences,
  isUserFrozen,
}: ListRowActionsProps) => {
  const { translate } = useTranslate();
  const { isCredentialsGloballyProtected } = useCredentialsContext();
  const { isSharingAllowed, isSharingEnabled, itemsPermission } =
    useSharingContext();
  const { id, URL } = credential;
  const permission = itemsPermission[credential.id];
  const openWebsiteDisabled = !URL;
  const noWebsiteLabel = translate(I18N_KEYS.NO_WEBSITE_TOOLTIP);
  return (
    <div
      data-testid="quick-action-container"
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        sx={{
          marginRight: "8px",
        }}
      >
        <Tooltip
          content={
            openWebsiteDisabled
              ? noWebsiteLabel
              : translate(I18N_KEYS.OPEN_WEBSITE)
          }
          location="bottom"
        >
          <Button
            title={translate(I18N_KEYS.OPEN_WEBSITE)}
            icon="ActionOpenExternalLinkOutlined"
            layout="iconOnly"
            mood="brand"
            intensity="supershy"
            name="hiddenAction"
            role="link"
            onClick={() => {
              logOpenCredentialUrl(id, URL);
              openUrl(URL);
            }}
            aria-label={
              openWebsiteDisabled
                ? noWebsiteLabel
                : translate(I18N_KEYS.OPEN_WEBSITE)
            }
            disabled={openWebsiteDisabled}
            sx={{
              opacity: "0",
              ":disabled": {
                cursor: "not-allowed",
              },
            }}
          />
        </Tooltip>
      </div>
      <QuickActionsMenu
        credential={credential}
        credentialItemRoute={credentialItemRoute}
        credentialPreferences={credentialPreferences}
        isCredentialsGloballyProtected={isCredentialsGloballyProtected}
        isSharingEnabled={isSharingEnabled}
        isSharingAllowed={isSharingAllowed}
        isUserFrozen={isUserFrozen}
        permission={permission}
        triggerButton={{
          layout: "iconOnly",
          intensity: "supershy",
          mood: "brand",
          icon: "ActionMoreOutlined",
          showCaret: false,
          "aria-label": translate(I18N_KEYS.ACTIONS_MENU),
        }}
      />
    </div>
  );
};
export const ListRowActions = memo(ListRowActionsComponent);
