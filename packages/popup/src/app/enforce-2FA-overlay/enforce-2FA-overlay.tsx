import React, { useEffect } from 'react';
import { colors, Heading, Paragraph } from '@dashlane/ui-components';
import { PageView } from '@dashlane/hermes';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { useModuleCommands } from '@dashlane/framework-react';
import { openWebAppAndClosePopup } from 'app/helpers';
import Dialog from 'components/dialog';
import useTranslate from 'libs/i18n/useTranslate';
import { logPageView } from 'src/libs/logs/logEvent';
import { useShouldEnforceTwoFactorAuthentication } from './use-should-enforce-two-factor-authentication';
const I18N_KEYS = {
    LOGOUT: 'login/log_out',
    TURN_ON_2FA_CTA: 'login/two-factor-authentication-turn-on-cta',
    TFA_ENFORCED_TITLE: 'login/two-factor-authentication-turn-on-title',
    TFA_ENFORCED_DESCRIPTION: 'login/two-factor-authentication-admin-enforce',
};
export const Enforce2FAOverlay = () => {
    const { translate } = useTranslate();
    const requires2faEnforce = useShouldEnforceTwoFactorAuthentication();
    const { logout } = useModuleCommands(AuthenticationFlowContracts.authenticationFlowApi);
    useEffect(() => {
        if (requires2faEnforce) {
            logPageView(PageView.LoginEnforce2faBusiness);
        }
    }, [requires2faEnforce]);
    return requires2faEnforce ? (<Dialog confirmLabel={translate(I18N_KEYS.TURN_ON_2FA_CTA)} onConfirm={() => {
            void openWebAppAndClosePopup({ route: '/passwords' });
        }} cancelLabel={translate(I18N_KEYS.LOGOUT)} onCancel={() => {
            logout();
        }} visible={true} cancelOnOutsideClick={false}>
      <Heading size="small">{translate(I18N_KEYS.TFA_ENFORCED_TITLE)}</Heading>
      <Paragraph color={colors.grey00} sx={{ marginTop: '16px', marginBottom: '24px' }}>
        {translate(I18N_KEYS.TFA_ENFORCED_DESCRIPTION)}
      </Paragraph>
    </Dialog>) : null;
};
