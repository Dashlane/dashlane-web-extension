import { Fragment } from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { jsx, Paragraph } from '@dashlane/design-system';
import { colors, Link } from '@dashlane/ui-components';
import { HELPCENTER_2FA_URL } from 'app/routes/constants';
const I18N_KEYS = {
    LINK_LEARN_MORE: 'webapp_account_security_settings_two_factor_authentication_turn_on_dialog_type_hc_link',
    DESCRIPTION_1: 'webapp_account_security_settings_two_factor_authentication_disabled_description_1',
    DESCRIPTION_2: 'webapp_account_security_settings_two_factor_authentication_disabled_description_2',
};
export const TwoFactorAuthenticationDisabled = () => {
    const { translate } = useTranslate();
    return (<>
      <Paragraph color="ds.text.neutral.standard" sx={{ margin: '16px 0', marginBottom: '8px' }} textStyle="ds.body.standard.regular">
        {translate(I18N_KEYS.DESCRIPTION_1)}
      </Paragraph>
      <Paragraph color="ds.text.neutral.standard" sx={{ margin: '16px 0', marginBottom: '8px' }} textStyle="ds.body.standard.regular">
        {translate(I18N_KEYS.DESCRIPTION_2)}
      </Paragraph>
      <Link target="_blank" rel="noopener noreferrer" href={HELPCENTER_2FA_URL} color={colors.midGreen00}>
        {translate(I18N_KEYS.LINK_LEARN_MORE)}
      </Link>
    </>);
};
