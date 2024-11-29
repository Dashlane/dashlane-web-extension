import React from "react";
import { AccountSubPanel } from "../../account-subpanel/account-subpanel";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { AuthenticatorSection } from "./authenticator-section";
import { BackupPhoneSection } from "./backup-phone-section";
import { SecurityLevelSection } from "./security-level-section";
import { U2fSection } from "./u2f-section";
import { Section } from "./section";
import {
  useTwoFactorAuthenticationInfo,
  useU2FDevices,
} from "../../../two-factor-authentication/hooks";
import { TwoFactorAuthenticationInfoRequestStatus } from "@dashlane/communication";
export interface Props {
  onNavigateOut: () => void;
}
const I18N_KEYS = {
  HEADING: "webapp_account_security_settings_2fa_heading",
  AUTHENTICATOR: "webapp_account_security_settings_2fa_authenticator_title",
  AUTHENTICATOR_ARIA_LABEL:
    "webapp_account_security_settings_two_factor_authentication_title",
  AUTHENTICATOR_DESCRIPTION:
    "webapp_account_security_settings_2fa_authenticator_app_description",
  U2F: "webapp_account_security_settings_2fa_u2f_title",
  U2F_DESCRIPTION: "webapp_account_security_settings_2fa_u2f_description",
  BACKUP: "webapp_account_security_settings_2fa_backup_title",
  BACKUP_DESCRIPTION: "webapp_account_security_settings_2fa_backup_description",
  SECURITY: "webapp_account_security_settings_2fa_security_level_title",
  SECURITY_DESCRIPTION:
    "webapp_account_security_settings_2fa_security_level_description_markup",
};
export const TwoFactorAuthenticationRoot = ({ onNavigateOut }: Props) => {
  const { translate } = useTranslate();
  const u2fDevices = useU2FDevices();
  const twoFactorAuthenticationInfo = useTwoFactorAuthenticationInfo();
  return (
    <AccountSubPanel
      headingText={translate(I18N_KEYS.HEADING)}
      headingAriaLabelledby={translate(I18N_KEYS.AUTHENTICATOR_ARIA_LABEL)}
      onNavigateOut={onNavigateOut}
    >
      <Section
        title={translate(I18N_KEYS.AUTHENTICATOR)}
        description={translate(I18N_KEYS.AUTHENTICATOR_DESCRIPTION)}
      >
        <AuthenticatorSection />
      </Section>
      {u2fDevices.length > 0 && (
        <Section
          title={translate(I18N_KEYS.U2F)}
          description={translate(I18N_KEYS.U2F_DESCRIPTION)}
        >
          <U2fSection authenticators={u2fDevices} />
        </Section>
      )}
      {twoFactorAuthenticationInfo?.status ===
      TwoFactorAuthenticationInfoRequestStatus.READY ? (
        <>
          <Section
            title={translate(I18N_KEYS.BACKUP)}
            description={translate(I18N_KEYS.BACKUP_DESCRIPTION)}
          >
            <BackupPhoneSection
              recoveryPhone={twoFactorAuthenticationInfo?.recoveryPhone}
            />
          </Section>
          <Section
            title={translate(I18N_KEYS.SECURITY)}
            description={translate.markup(
              I18N_KEYS.SECURITY_DESCRIPTION,
              {},
              { linkTarget: "_blank" }
            )}
          >
            <SecurityLevelSection
              twoFactorAuthenticationMode={twoFactorAuthenticationInfo.type}
            />
          </Section>
        </>
      ) : null}
    </AccountSubPanel>
  );
};
