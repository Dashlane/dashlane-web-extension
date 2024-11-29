import {
  colors,
  Heading,
  LoadingIcon,
  Paragraph,
} from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  CHANGES_TITLE:
    "webapp_account_security_settings_two_factor_authentication_disable_preparing_title",
  CHANGES_DESCRIPTION:
    "webapp_account_security_settings_two_factor_authentication_disable_loading_description",
  CHANGES_BROSWER_DESCRIPTION:
    "webapp_account_security_settings_two_factor_authentication_disable_loading_browser_description",
};
export const TwoFactorAuthenticationLoadingDialog = () => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        maxWidth: "480px",
      }}
    >
      <LoadingIcon color={colors.midGreen00} size="60px" />
      <Heading size="small" sx={{ marginTop: "24px", color: colors.black }}>
        {translate(I18N_KEYS.CHANGES_TITLE)}
      </Heading>
      <Paragraph sx={{ marginTop: "16px", color: colors.grey00 }}>
        {translate(I18N_KEYS.CHANGES_DESCRIPTION)}
      </Paragraph>
      <Paragraph sx={{ marginTop: "16px", color: colors.grey00 }}>
        {translate(I18N_KEYS.CHANGES_BROSWER_DESCRIPTION)}
      </Paragraph>
    </div>
  );
};
