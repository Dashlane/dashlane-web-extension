import classnames from 'classnames';
import { Button, jsx, Paragraph } from '@dashlane/design-system';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { Header, Navigation, WebappLoginLayout, } from 'auth/login-panel/authentication-flow/components';
import { BaseMarketingContainer } from 'auth/base-marketing-container/base-marketing-container';
import { StandardMarketingContainer } from 'auth/marketing-container/standard';
import styles from '../../../../../styles.css';
export const I18N_KEYS = {
    TITLE: 'webapp_device_to_device_authentication_device_setup_title',
    DESCRIPTION: 'webapp_device_to_device_authentication_device_setup_description_markup',
    ACCESS_VAULT: 'webapp_device_to_device_authentication_device_setup_access_vault_cta',
};
export const DeviceTransferSuccess = () => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const handleRedirectToVault = () => {
        redirect(routes.userCredentials);
    };
    return (<div sx={{ backgroundColor: 'ds.container.agnostic.neutral.supershy' }} className={styles.panelsContainer}>
      <StandardMarketingContainer />
      <div className={classnames(styles.panelContainer, styles.loginPanelContainer)}>
        <Navigation />
        <BaseMarketingContainer backgroundColor="ds.background.default">
          <WebappLoginLayout>
            <Header text={translate(I18N_KEYS.TITLE)}/>
            <Paragraph>{translate.markup(I18N_KEYS.DESCRIPTION)}</Paragraph>
            <Button fullsize mood="brand" intensity="catchy" onClick={handleRedirectToVault}>
              {translate(I18N_KEYS.ACCESS_VAULT)}
            </Button>
          </WebappLoginLayout>
        </BaseMarketingContainer>
      </div>
    </div>);
};
