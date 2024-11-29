import { useState } from "react";
import {
  ButtonProps,
  DropdownMenu,
  DropdownTriggerButton,
} from "@dashlane/design-system";
import { ParsedURL } from "@dashlane/url-parser";
import { Credential } from "@dashlane/vault-contracts";
import { Permission } from "@dashlane/sharing-contracts";
import { CredentialPreferences } from "@dashlane/autofill-contracts";
import { AlertSeverity } from "@dashlane/ui-components";
import {
  DropdownType,
  Field,
  ItemType,
  PageView,
  UserOpenVaultItemDropdownEvent,
} from "@dashlane/hermes";
import { openUrl } from "../../../libs/external-urls";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import { logOpenCredentialUrl } from "../../../libs/logs/events/vault/open-external-vault-item-link";
import { redirect } from "../../../libs/router";
import { sendLogsForCopyVaultItem } from "./logs";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import { Menu } from "./menu/menu";
import { useSearchContext } from "../../search/search-context";
import { useProtectedItemsUnlocker } from "../../unlock-items";
import { useActivityLogReport } from "../../hooks/use-activity-log-report";
const I18N_KEYS = {
  COPY_ERROR_ALERT: "webapp_generic_copy_to_clipboard_feedback_error",
};
interface QuickActionsMenuProps {
  credential: Credential;
  credentialPreferences: CredentialPreferences;
  permission?: Permission;
  isSharingEnabled: boolean;
  isSharingAllowed: boolean;
  isUserFrozen: boolean;
  isCredentialsGloballyProtected: boolean;
  credentialItemRoute: string;
  searchEmbedded?: boolean;
  triggerButton?: ButtonProps & {
    showCaret: boolean;
  };
  triggerLabel?: string;
}
export const QuickActionsMenu = ({
  credential,
  credentialPreferences,
  permission,
  isSharingEnabled,
  isSharingAllowed,
  isUserFrozen,
  isCredentialsGloballyProtected,
  credentialItemRoute,
  searchEmbedded,
  triggerButton,
  triggerLabel,
}: QuickActionsMenuProps) => {
  const { closeSearch } = useSearchContext();
  const { translate } = useTranslate();
  const copyErrorAlert = useAlert();
  const { protectedItemsUnlockerShown } = useProtectedItemsUnlocker();
  const { logCopiedCredentialField } = useActivityLogReport();
  const [isOpen, setIsOpen] = useState(false);
  const requireMasterPassword = Boolean(
    credentialPreferences?.requireMasterPassword
  );
  const onOpenChangeHandler = () => {
    if (protectedItemsUnlockerShown) {
      return;
    }
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      logPageView(PageView.ItemQuickActionsDropdown);
      logEvent(
        new UserOpenVaultItemDropdownEvent({
          dropdownType: DropdownType.QuickActions,
          itemType: ItemType.Credential,
        })
      );
    }
  };
  const onEditItem = () => {
    if (searchEmbedded) {
      closeSearch();
    }
    redirect(credentialItemRoute);
  };
  const onGoToWebsite = () => {
    void logOpenCredentialUrl(credential.id, credential.URL);
    const parsedUrl = new ParsedURL(credential.URL);
    openUrl(parsedUrl.getUrlWithFallbackHttpsProtocol());
  };
  const onCopyLogin = () => {
    sendLogsForCopyVaultItem(credential.id, credential.URL, Field.Login, false);
  };
  const onCopyEmail = () => {
    sendLogsForCopyVaultItem(credential.id, credential.URL, Field.Email, false);
  };
  const onCopyPassword = () => {
    const credentialURL = credential.URL;
    const credentialLogin =
      credential.email || credential.username || credential.alternativeUsername;
    const isProtected = requireMasterPassword || isCredentialsGloballyProtected;
    const hasTeamSpaceId = Boolean(credential.spaceId);
    sendLogsForCopyVaultItem(
      credential.id,
      credential.URL,
      Field.Password,
      isProtected
    );
    if (hasTeamSpaceId) {
      logCopiedCredentialField({
        credentialLogin,
        credentialURL,
      });
    }
  };
  const onCopyHandler = (onCopyFunction: () => void, success: boolean) => {
    onCopyFunction();
    if (!success) {
      copyErrorAlert.showAlert(
        translate(I18N_KEYS.COPY_ERROR_ALERT),
        AlertSeverity.ERROR
      );
    }
  };
  const onCloseHandler = (closeSearchToo = false) => {
    setIsOpen(false);
    if (searchEmbedded && closeSearchToo) {
      closeSearch();
    }
  };
  return (
    <DropdownMenu onOpenChange={onOpenChangeHandler} isOpen={isOpen}>
      <DropdownTriggerButton showCaret {...triggerButton}>
        {triggerLabel}
      </DropdownTriggerButton>
      <Menu
        autoProtected={requireMasterPassword}
        permission={permission}
        isCredentialsGloballyProtected={isCredentialsGloballyProtected}
        isSharingEnabled={isSharingEnabled}
        isSharingAllowed={isSharingAllowed}
        isUserFrozen={isUserFrozen}
        closePopover={onCloseHandler}
        id={credential.id}
        login={credential.username}
        email={credential.email}
        onCopyLogin={(success) => onCopyHandler(onCopyLogin, success)}
        onCopyPassword={(success) => onCopyHandler(onCopyPassword, success)}
        onCopyEmail={(success) => onCopyHandler(onCopyEmail, success)}
        onEditItem={onEditItem}
        onGoToWebsite={onGoToWebsite}
        password={credential.password}
        spaceId={credential.spaceId}
        title={credential.itemName}
        url={credential.URL}
      />
    </DropdownMenu>
  );
};
