import useTranslate from "../../../../../libs/i18n/useTranslate";
import { Paragraph } from "@dashlane/design-system";
const I18N_KEYS = {
  ENFORCED_DESCRIPTION:
    "webapp_account_security_settings_two_factor_authentication_enforced_enabled_description",
};
export const EnforcedTwoFactorAuthenticationEnabled = () => {
  const { translate } = useTranslate();
  return (
    <Paragraph
      color="ds.text.neutral.standard"
      sx={{ margin: "16px 0", marginBottom: "8px" }}
      textStyle="ds.body.standard.regular"
    >
      {translate(I18N_KEYS.ENFORCED_DESCRIPTION)}
    </Paragraph>
  );
};
