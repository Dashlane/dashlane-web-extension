import { LinkButton, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { HELPCENTER_2FA_URL } from "../../../../../app/routes/constants";
const I18N_KEYS = {
  LINK_LEARN_MORE:
    "webapp_account_security_settings_two_factor_authentication_turn_on_dialog_type_hc_link",
  DESCRIPTION_1:
    "webapp_account_security_settings_two_factor_authentication_disabled_description_1",
  DESCRIPTION_2:
    "webapp_account_security_settings_two_factor_authentication_disabled_description_2",
};
export const TwoFactorAuthenticationDisabled = () => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <Paragraph
        textStyle="ds.body.standard.regular"
        color="ds.text.neutral.standard"
      >
        {translate(I18N_KEYS.DESCRIPTION_1)}
      </Paragraph>
      <Paragraph
        textStyle="ds.body.standard.regular"
        color="ds.text.neutral.standard"
      >
        {translate(I18N_KEYS.DESCRIPTION_2)}
      </Paragraph>
      <LinkButton href={HELPCENTER_2FA_URL} isExternal>
        {translate(I18N_KEYS.LINK_LEARN_MORE)}
      </LinkButton>
    </div>
  );
};
