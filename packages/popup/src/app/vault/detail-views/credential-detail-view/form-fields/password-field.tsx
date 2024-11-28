import React from "react";
import { useToast } from "@dashlane/design-system";
import {
  AnonymousCopyVaultItemFieldEvent,
  DomainType,
  Field,
  hashDomain,
  ItemType,
  UserCopyVaultItemFieldEvent,
} from "@dashlane/hermes";
import { ParsedURL } from "@dashlane/url-parser";
import { Credential, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../../libs/logs/logEvent";
import useProtectedItemsUnlocker from "../../../../protected-items-unlocker/useProtectedItemsUnlocker";
import { useCredentialPasswordStatus } from "../../../../../libs/credentials/useCredentialPasswordStatus";
import { PasswordStatus } from "../../../../../libs/credentials/types";
import { ConfirmLabelMode } from "../../../../protected-items-unlocker/master-password-dialog";
import { useCredentialPasswordIsProtected } from "../../../../../libs/credentials/useCredentialPasswordIsProtected";
import { useAlertAutofillEngine } from "../../../../use-autofill-engine";
import { ProtectedValueField } from "../../../../../components/inputs/common/protected-value-field/protected-value-field";
export const I18N_KEYS = {
  LABEL: "tab/all_items/credential/view/label/password",
  PASSWORD_COPIED:
    "tab/all_items/credential/actions/password_copied_to_clipboard",
  PASSWORD_COPY: "tab/all_items/credential/actions/copy_password",
  PASSWORD_SHOW: "tab/all_items/credential/actions/show_password",
  PASSWORD_HIDE: "tab/all_items/credential/actions/hide_password",
};
interface PasswordFieldProps {
  credential: Credential;
  shouldItemBeVisible: boolean;
  isCopyDisabled?: boolean;
}
const sendLogsForCopyVaultItem = async (
  id: string,
  URL: string,
  isProtected: boolean
) => {
  void logEvent(
    new UserCopyVaultItemFieldEvent({
      itemType: ItemType.Credential,
      field: Field.Password,
      itemId: id,
      isProtected: isProtected,
    })
  );
  const rootDomain = new ParsedURL(URL).getRootDomain();
  void logEvent(
    new AnonymousCopyVaultItemFieldEvent({
      itemType: ItemType.Credential,
      field: Field.Password,
      domain: {
        id: await hashDomain(rootDomain),
        type: DomainType.Web,
      },
    })
  );
};
const PasswordFieldComponent: React.FC<PasswordFieldProps> = ({
  credential,
  shouldItemBeVisible,
  isCopyDisabled = false,
}) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const alertAutofillEngine = useAlertAutofillEngine();
  const { openProtectedItemsUnlocker, areProtectedItemsUnlocked } =
    useProtectedItemsUnlocker();
  const passwordStatus = useCredentialPasswordStatus(credential.id, {
    areProtectedItemsUnlocked,
  });
  const isProtected = useCredentialPasswordIsProtected(credential.id);
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(credential.password);
    await sendLogsForCopyVaultItem(
      credential.id,
      credential.URL,
      isProtected ?? true
    );
    showToast({
      description: translate(I18N_KEYS.PASSWORD_COPIED),
    });
  };
  const handleCopyPasswordClick = React.useCallback(async () => {
    switch (passwordStatus) {
      case PasswordStatus.Unknown:
        break;
      case PasswordStatus.Limited:
        break;
      case PasswordStatus.Protected:
        openProtectedItemsUnlocker({
          confirmLabelMode: ConfirmLabelMode.CopyPassword,
          onSuccess: () => {
            void copyToClipboard();
          },
          showNeverAskOption: true,
          credentialId: credential.id,
        });
        break;
      case PasswordStatus.Unlocked:
        await copyToClipboard();
        await alertAutofillEngine(
          credential.id,
          credential.password,
          VaultItemType.Credential,
          Field.Password
        );
    }
  }, [
    credential.id,
    credential.password,
    credential.URL,
    openProtectedItemsUnlocker,
    passwordStatus,
    isProtected,
  ]);
  return (
    <ProtectedValueField
      showNeverAskOption
      data-name="password"
      shouldItemBeVisible={shouldItemBeVisible}
      protectedItemId={credential.id}
      isItemProtected={!!isProtected}
      valueFieldId="password"
      valueFieldLabel={translate(I18N_KEYS.LABEL)}
      value={credential.password}
      fieldType={ItemType.Credential}
      revealValueLabel={translate(I18N_KEYS.PASSWORD_SHOW)}
      hideValueLabel={translate(I18N_KEYS.PASSWORD_HIDE)}
      onCopyClick={() => {
        void handleCopyPasswordClick();
      }}
      isCopyDisabled={isCopyDisabled}
      copyValueLabel={translate(I18N_KEYS.PASSWORD_COPY)}
    />
  );
};
export const PasswordField = React.memo(PasswordFieldComponent);
