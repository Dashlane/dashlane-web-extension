import { useEffect } from "react";
import { TwoFactorAuthenticationError } from "@dashlane/hermes";
import {
  colors,
  CrossCircleIcon,
  DialogFooter,
  Heading,
  Paragraph,
} from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  ERROR_TITLE:
    "webapp_account_security_settings_two_factor_authentication_disable_generic_error_title",
  ERROR_DESCRIPTION:
    "webapp_account_security_settings_two_factor_authentication_disable_generic_error_description",
  ERROR_CLOSE:
    "webapp_account_security_settings_two_factor_authentication_disable_generic_error_close",
};
interface Props {
  handleClickOnClose: () => void;
  logEvent?: (error: TwoFactorAuthenticationError) => void;
}
export const TwoFactorAuthenticationGenericErrorDialog = ({
  handleClickOnClose,
  logEvent,
}: Props) => {
  const { translate } = useTranslate();
  useEffect(() => {
    logEvent?.(
      !self?.navigator?.onLine
        ? TwoFactorAuthenticationError.UserOfflineError
        : TwoFactorAuthenticationError.UnknownError
    );
  }, []);
  return (
    <div
      sx={{
        maxWidth: "480px",
      }}
    >
      <div
        sx={{
          transform: "translate(-5px, -5px)",
        }}
      >
        <CrossCircleIcon color={colors.midGreen00} size={75} />
      </div>
      <Heading size="small" sx={{ marginTop: "20px", color: colors.black }}>
        {translate(I18N_KEYS.ERROR_TITLE)}
      </Heading>
      <Paragraph
        sx={{ marginTop: "16px", marginBottom: "24px", color: colors.grey00 }}
      >
        {translate(I18N_KEYS.ERROR_DESCRIPTION)}
      </Paragraph>
      <DialogFooter
        primaryButtonProps={{
          type: "button",
          autoFocus: true,
        }}
        primaryButtonTitle={translate(I18N_KEYS.ERROR_CLOSE)}
        primaryButtonOnClick={handleClickOnClose}
      />
    </div>
  );
};
