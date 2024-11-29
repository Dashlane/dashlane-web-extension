import { useEffect } from "react";
import { VaultItemsCrudFeatureFlips } from "@dashlane/vault-contracts";
import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ActivePanel } from "../security-settings";
import { AccountSubPanel } from "../../account-subpanel/account-subpanel";
import { useWebAuthnAuthentication } from "../../../webauthn";
import { useTwoFactorAuthenticationInfo } from "../../../two-factor-authentication/hooks";
import {
  refreshTwoFactorAuthenticationInfo,
  refreshU2FDevices,
} from "../../../two-factor-authentication/services";
import { AccountRecoverySettingsSection } from "./account-recovery-settings-section/account-recovery-settings-section";
import { ChangeMasterPasswordSection } from "./change-master-password-section/change-master-password-section";
import { CryptoSettingsSection } from "./crypto-settings-section/crypto-settings-section";
import { WebAuthnSettingsSection } from "./webauthn-settings-section/webauthn-settings-section";
import { TwoFactorAuthenticationSettingsSection } from "./two-factor-authentication-settings-section/two-factor-authentication-settings-section";
import { MasterPasswordSettings } from "./master-password-settings/master-password-settings";
import { RecoveryKeySection } from "../account-recovery-root/sections/recovery-key-section";
import { PinUnlockSection } from "./pin-unlock-section/pin-unlock-section";
import { useIsSSOUser } from "../hooks/useIsSSOUser";
import { useIsMPlessUser } from "../hooks/use-is-mpless-user";
import { RichIconsSettings } from "./rich-icons-settings-section/rich-icons-settings";
import { useRichIconsSetting } from "../../../../libs/carbon/hooks/useRichIconsSetting";
import {
  TwoFactorAuthenticationInfoRequestStatus,
  TwoFactorAuthenticationType,
} from "@dashlane/communication";
export interface Props {
  onNavigateOut: () => void;
  changeActivePanel: (panel: ActivePanel) => void;
  onDialogStateChanged?: (isDialogOpened: boolean) => void;
}
const I18N_KEYS = {
  HEADING: "webapp_account_security_settings_heading",
};
export const SecuritySettingsRoot = ({
  onNavigateOut,
  changeActivePanel,
  onDialogStateChanged,
}: Props) => {
  const { translate } = useTranslate();
  const isSSOUser = useIsSSOUser();
  const { status: isMPLessUserStatus, isMPLessUser } = useIsMPlessUser();
  const isMPUser = !isSSOUser && !isMPLessUser;
  const webAuthnAuthentication = useWebAuthnAuthentication();
  const twoFactorAuthenticationInfo = useTwoFactorAuthenticationInfo();
  const isOtp2User =
    twoFactorAuthenticationInfo?.status ===
      TwoFactorAuthenticationInfoRequestStatus.READY &&
    twoFactorAuthenticationInfo.isTwoFactorAuthenticationEnabled &&
    twoFactorAuthenticationInfo?.type === TwoFactorAuthenticationType.LOGIN;
  const hasRichIconFeatureFlip = useFeatureFlip(
    VaultItemsCrudFeatureFlips.RichIconsDev
  );
  const areRichIconsEnabled = useRichIconsSetting();
  useEffect(() => {
    refreshTwoFactorAuthenticationInfo();
    refreshU2FDevices();
  }, []);
  return (
    <AccountSubPanel
      headingText={translate(I18N_KEYS.HEADING)}
      onNavigateOut={onNavigateOut}
    >
      {isMPLessUserStatus !== DataStatus.Success ? null : !isMPLessUser ? (
        <WebAuthnSettingsSection
          changeActivePanel={changeActivePanel}
          webAuthnOptedIn={webAuthnAuthentication.optedIn}
          authenticators={webAuthnAuthentication.authenticators}
          onDialogStateChanged={onDialogStateChanged}
        />
      ) : null}
      {!isOtp2User && !isSSOUser && APP_PACKAGED_IN_EXTENSION ? (
        <PinUnlockSection isMPUser={isMPUser} />
      ) : null}

      {isMPLessUserStatus !== DataStatus.Success ? null : !isMPLessUser ? (
        <TwoFactorAuthenticationSettingsSection
          changeActivePanel={changeActivePanel}
          onDialogStateChanged={onDialogStateChanged}
          twoFactorAuthenticationInfo={twoFactorAuthenticationInfo}
        />
      ) : null}
      {isMPUser ? (
        <ChangeMasterPasswordSection
          changeActivePanel={changeActivePanel}
          twoFactorAuthenticationInfo={twoFactorAuthenticationInfo}
        />
      ) : null}
      {isMPUser ? (
        <AccountRecoverySettingsSection changeActivePanel={changeActivePanel} />
      ) : null}
      {isMPLessUserStatus !== DataStatus.Success ? null : isMPLessUser ? (
        <RecoveryKeySection />
      ) : null}

      {isMPUser ? <MasterPasswordSettings /> : null}
      <CryptoSettingsSection />
      {hasRichIconFeatureFlip &&
        areRichIconsEnabled.status === DataStatus.Success && (
          <RichIconsSettings checked={areRichIconsEnabled.data} />
        )}
    </AccountSubPanel>
  );
};
