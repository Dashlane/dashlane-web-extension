import { DialogTitle, Paragraph, TokenInput } from "@dashlane/ui-components";
import { colors } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { TOKEN_LENGTH } from "./constants";
import { SyncDevicesTimeInfoBox } from "../sync-devices-time-infobox";
import {
  NavLink,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
const I18N_KEYS = {
  AUTHENTICATOR_TITLE:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_title",
  AUTHENTICATOR_CONTENT:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_content",
  AUTHENTICATOR_LINK:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_link",
  AUTHENTICATOR_PRIMARY_BUTTON:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_button",
  SECURITY_CODE_LOST_PHONE: "webapp_two_factor_authentication_lost_your_phone",
  SECURITY_CODE_LOST_PHONE_LINK: "webapp_two_factor_authentication_reset_2fa",
};
interface Props {
  handleAuthenticatorModeClick?: () => void;
  updateAuthenticatorCode: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  code: string;
  errorMessage?: string;
  showSyncDevicesHelp?: boolean;
  hideAdditionalActions?: boolean;
  login: string;
}
export const AuthenticationCodeForm = ({
  handleAuthenticatorModeClick,
  code,
  updateAuthenticatorCode,
  errorMessage,
  login,
  showSyncDevicesHelp = false,
  hideAdditionalActions = false,
}: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  return (
    <div
      sx={{
        maxWidth: "480px",
        paddingBottom: "1px",
      }}
    >
      <DialogTitle
        title={
          <span
            sx={{
              display: "inline-block",
              marginBottom: "12px",
              fontWeight: "500",
            }}
          >
            {translate(I18N_KEYS.AUTHENTICATOR_TITLE)}
          </span>
        }
      />
      <TokenInput
        autoFocus={true}
        maxLength={TOKEN_LENGTH}
        value={code}
        onChange={updateAuthenticatorCode}
        feedbackType={errorMessage ? "error" : undefined}
        feedbackText={errorMessage ? translate(errorMessage) : undefined}
        data-testid="two-factor-authentication-code"
      />
      {showSyncDevicesHelp ? <SyncDevicesTimeInfoBox /> : null}

      {!hideAdditionalActions ? (
        <>
          <Paragraph
            sx={{
              marginTop: "16px",
              lineHeight: "initial",
              padding: "4px 0px",
            }}
            color={colors.lightTheme.ds.text.inverse.quiet}
          >
            {translate(I18N_KEYS.AUTHENTICATOR_CONTENT)}{" "}
            <button
              type="button"
              onClick={handleAuthenticatorModeClick}
              sx={{
                fontSize: "15px",
                fontWeight: 500,
                color: colors.lightTheme.ds.text.brand.standard,
                textDecoration: "underline",
                padding: "0px",
                background: "none",
                borderRadius: "4px",
                border: 0,
                outlineOffset: "3px",
                outlineColor: colors.lightTheme.ds.oddity.focus,
                "&:hover": {
                  textDecoration: "none",
                },
                "&:focus": {
                  border: 1,
                },
              }}
            >
              {translate(I18N_KEYS.AUTHENTICATOR_LINK)}
            </button>
          </Paragraph>
          <Paragraph
            sx={{ lineHeight: "initial", padding: "4px 0px" }}
            color={colors.lightTheme.ds.text.inverse.quiet}
          >
            {translate(I18N_KEYS.SECURITY_CODE_LOST_PHONE)}{" "}
            <NavLink
              color="ds.text.brand.standard"
              to={routes.recover2faCodes(login)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {translate(I18N_KEYS.SECURITY_CODE_LOST_PHONE_LINK)}
            </NavLink>
          </Paragraph>
        </>
      ) : null}
    </div>
  );
};
