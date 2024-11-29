import { Flex } from "@dashlane/design-system";
import { colors, LockIcon, Paragraph } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { TwoFactorAuthenticationType } from "@dashlane/communication";
const I18N_KEYS = {
  VALUE_REGISTRATION:
    "webapp_account_security_settings_2fa_security_level_value",
  VALUE_LOGIN:
    "webapp_account_security_settings_2fa_security_level_value_login",
};
interface Props {
  twoFactorAuthenticationMode: TwoFactorAuthenticationType;
}
export const SecurityLevelSection = ({
  twoFactorAuthenticationMode,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <Flex sx={{ marginTop: "20px" }} alignItems="center">
      <LockIcon />
      <Paragraph sx={{ paddingLeft: "11px", flex: 1 }} color={colors.black}>
        {translate(
          twoFactorAuthenticationMode ===
            TwoFactorAuthenticationType.DEVICE_REGISTRATION
            ? I18N_KEYS.VALUE_REGISTRATION
            : I18N_KEYS.VALUE_LOGIN
        )}
      </Paragraph>
    </Flex>
  );
};
