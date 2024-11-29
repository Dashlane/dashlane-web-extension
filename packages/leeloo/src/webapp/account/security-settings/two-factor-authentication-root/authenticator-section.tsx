import { Flex } from "@dashlane/design-system";
import { AuthenticatorIcon, colors } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  VALUE: "webapp_account_security_settings_2fa_authenticator_app_value",
};
export const AuthenticatorSection = () => {
  const { translate } = useTranslate();
  return (
    <Flex sx={{ color: colors.black, marginTop: "32px" }} alignItems="center">
      <AuthenticatorIcon />
      <span sx={{ paddingLeft: "13px" }}>{translate(I18N_KEYS.VALUE)}</span>
    </Flex>
  );
};
