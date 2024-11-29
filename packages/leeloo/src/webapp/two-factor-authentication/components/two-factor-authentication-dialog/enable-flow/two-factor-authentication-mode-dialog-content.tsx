import { useEffect, useState } from "react";
import {
  colors,
  DialogBody,
  DialogFooter,
  Heading,
  InfoBox,
  Link,
  Radio,
  RadioGroup,
  ThemeUIStyleObject,
} from "@dashlane/ui-components";
import {
  TwoFactorAuthenticationType,
  type TwoFactorAuthenticationTypeStageRequest,
} from "@dashlane/communication";
import { HELPCENTER_2FA_URL } from "../../../../../app/routes/constants";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { TwoFactorAuthenticationUserEnableMode } from "../../../mocks/types";
import { logTwoFactorAuthenticationEnableSecurityLevelPageView } from "../../../logs/enable-flow-logs";
const I18N_KEYS = {
  TITLE:
    "webapp_account_security_settings_two_factor_authentication_turn_on_dialog_type_title",
  OPTION_NEW_DEVICE:
    "webapp_account_security_settings_two_factor_authentication_turn_on_dialog_type_registration_option",
  OPTION_EACH_LOGIN:
    "webapp_account_security_settings_two_factor_authentication_turn_on_dialog_type_login_option",
  LINK_LEARN_MORE:
    "webapp_account_security_settings_two_factor_authentication_turn_on_dialog_type_hc_link",
  SECTION_WARNING:
    "webapp_account_security_settings_two_factor_authentication_turn_on_dialog_type_login_info",
  CANCEL: "_common_action_cancel",
  CONTINUE: "_common_action_continue",
};
const DIALOG_TITLE_STYLE = {
  marginTop: "16px",
  marginBottom: "18px",
};
const INFOBOX_STYLE: ThemeUIStyleObject = {
  marginTop: "24px",
};
interface Props {
  handleClickOnSubmit: (
    params: TwoFactorAuthenticationTypeStageRequest
  ) => void;
  handleClickOnClose: () => void;
  savedValues?: {
    savedAuthenticationType?:
      | TwoFactorAuthenticationType.DEVICE_REGISTRATION
      | TwoFactorAuthenticationType.LOGIN;
  };
}
export const TwoFactorAuthenticationModeDialog = ({
  handleClickOnSubmit,
  handleClickOnClose,
  savedValues,
}: Props) => {
  const [authenticationMode, setAuthenticationMode] =
    useState<TwoFactorAuthenticationUserEnableMode>(
      savedValues
        ? savedValues?.savedAuthenticationType
          ? savedValues.savedAuthenticationType
          : TwoFactorAuthenticationType.DEVICE_REGISTRATION
        : TwoFactorAuthenticationType.DEVICE_REGISTRATION
    );
  const { translate } = useTranslate();
  const handleOnModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthenticationMode(
      event.target.value as TwoFactorAuthenticationUserEnableMode
    );
  };
  useEffect(() => {
    logTwoFactorAuthenticationEnableSecurityLevelPageView();
  }, []);
  return (
    <div
      sx={{
        maxWidth: "480px",
      }}
    >
      <DialogBody>
        <Heading size="small" sx={DIALOG_TITLE_STYLE}>
          {translate(I18N_KEYS.TITLE)}
        </Heading>
        <RadioGroup
          onChange={handleOnModeChange}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Radio
            label={translate(I18N_KEYS.OPTION_NEW_DEVICE)}
            value={TwoFactorAuthenticationType.DEVICE_REGISTRATION}
            defaultChecked={
              authenticationMode ===
              TwoFactorAuthenticationType.DEVICE_REGISTRATION
            }
            data-testid="two-factor-authentication-mode-dialog-device-registration-option"
          />
          <Radio
            label={translate(I18N_KEYS.OPTION_EACH_LOGIN)}
            value={TwoFactorAuthenticationType.LOGIN}
            sx={{ marginBottom: "20px" }}
            data-testid="two-factor-authentication-mode-dialog-login-option"
            defaultChecked={
              authenticationMode === TwoFactorAuthenticationType.LOGIN
            }
          />
        </RadioGroup>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={HELPCENTER_2FA_URL}
          color={colors.midGreen00}
        >
          {translate(I18N_KEYS.LINK_LEARN_MORE)}
        </Link>
        {authenticationMode === TwoFactorAuthenticationType.LOGIN ? (
          <InfoBox
            severity="subtle"
            size="small"
            title={translate(I18N_KEYS.SECTION_WARNING)}
            sx={INFOBOX_STYLE}
          />
        ) : null}
      </DialogBody>
      <DialogFooter
        primaryButtonTitle={translate(I18N_KEYS.CONTINUE)}
        primaryButtonProps={{
          type: "button",
          autoFocus: true,
        }}
        primaryButtonOnClick={() => {
          handleClickOnSubmit({ authenticationType: authenticationMode });
        }}
        secondaryButtonTitle={translate(I18N_KEYS.CANCEL)}
        secondaryButtonOnClick={handleClickOnClose}
      />
    </div>
  );
};
