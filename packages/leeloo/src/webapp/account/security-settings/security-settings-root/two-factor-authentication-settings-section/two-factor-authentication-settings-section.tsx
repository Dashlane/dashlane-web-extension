import { ActivePanel } from "../../security-settings";
import { TwoFactorAuthenticationAvailableSection } from "./section-available";
import { TwoFactorAuthenticationLoadingSection } from "./section-loading";
import { TwoFactorAuthenticationNotAvailableSection } from "./section-not-available";
import {
  TwoFactorAuthenticationInfo,
  TwoFactorAuthenticationInfoRequestStatus,
  TwoFactorAuthenticationType,
} from "@dashlane/communication";
interface Props {
  changeActivePanel: (panel: ActivePanel) => void;
  onDialogStateChanged?: (isDialogOpened: boolean) => void;
  twoFactorAuthenticationInfo: TwoFactorAuthenticationInfo | undefined;
}
export const TwoFactorAuthenticationSettingsSection = ({
  changeActivePanel,
  onDialogStateChanged,
  twoFactorAuthenticationInfo,
}: Props) => {
  const I18N_KEYS = {
    UNKNOWN_ERROR:
      "webapp_account_security_settings_two_factor_authentication_turn_on_generic_error",
    TWO_FACTOR_AUTHENTICATION_DISABLED:
      "webapp_account_security_settings_two_factor_authentication_disabled",
    TWO_FACTOR_AUTHENTICATION_DISABLED_SSO:
      "webapp_account_security_settings_two_factor_authentication_disabled_sso",
  };
  if (
    !twoFactorAuthenticationInfo ||
    twoFactorAuthenticationInfo.status ===
      TwoFactorAuthenticationInfoRequestStatus.PENDING ||
    twoFactorAuthenticationInfo.status ===
      TwoFactorAuthenticationInfoRequestStatus.UNKNOWN
  ) {
    return <TwoFactorAuthenticationLoadingSection />;
  } else if (
    twoFactorAuthenticationInfo?.status ===
      TwoFactorAuthenticationInfoRequestStatus.READY &&
    twoFactorAuthenticationInfo?.type !== TwoFactorAuthenticationType.SSO &&
    APP_PACKAGED_IN_EXTENSION
  ) {
    return (
      <TwoFactorAuthenticationAvailableSection
        changeActivePanel={changeActivePanel}
        onDialogStateChanged={onDialogStateChanged}
        twoFactorAuthenticationInfo={twoFactorAuthenticationInfo}
      />
    );
  } else {
    const isSSOUser =
      twoFactorAuthenticationInfo?.status ===
        TwoFactorAuthenticationInfoRequestStatus.READY &&
      twoFactorAuthenticationInfo?.type === TwoFactorAuthenticationType.SSO;
    const unavailableMessage =
      twoFactorAuthenticationInfo?.status ===
      TwoFactorAuthenticationInfoRequestStatus.ERROR
        ? I18N_KEYS.UNKNOWN_ERROR
        : isSSOUser
        ? I18N_KEYS.TWO_FACTOR_AUTHENTICATION_DISABLED_SSO
        : I18N_KEYS.TWO_FACTOR_AUTHENTICATION_DISABLED;
    return (
      <TwoFactorAuthenticationNotAvailableSection
        error={
          twoFactorAuthenticationInfo.status ===
          TwoFactorAuthenticationInfoRequestStatus.ERROR
        }
        message={unavailableMessage}
      />
    );
  }
};
