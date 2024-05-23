import { Fragment, ReactNode } from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Capabilities } from '@dashlane/communication';
import { Button, CreditMonitoringIcon, Heading, IdentityRestaurationIcon as IdentityRestorationIcon, IdentityTheftIcon, jsx, } from '@dashlane/ui-components';
import { Header } from 'webapp/components/header/header';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { PersonalDataSectionView } from 'webapp/personal-data-section-view/personal-data-section-view';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { openDashlaneUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './premium-plus.css';
import { TransunionIcon } from './icons/transunion-icon';
import { AigIcon } from './icons/aig-icon';
const I18N_KEYS = {
    TITLE: 'webapp_premium_plus_title',
    CREDIT_MONITORING_BUTTON: 'webapp_premium_plus_credit_monitoring_button',
    CREDIT_MONITORING_DESCRIPTION: 'webapp_premium_plus_credit_monitoring_description_markup',
    CREDIT_MONITORING_TITLE: 'webapp_premium_plus_credit_monitoring_title',
    IDENTITY_RESTAURATION_BUTTON: 'webapp_premium_plus_identity_restauration_button',
    IDENTITY_RESTAURATION_DESCRIPTION: 'webapp_premium_plus_identity_restauration_description_markup',
    IDENTITY_RESTAURATION_TITLE: 'webapp_premium_plus_identity_restauration_title',
    IDENTITY_THEFT_BUTTON: 'webapp_premium_plus_identity_theft_button',
    IDENTITY_THEFT_DESCRIPTION: 'webapp_premium_plus_identity_theft_description_markup',
    IDENTITY_THEFT_TITLE: 'webapp_premium_plus_identity_theft_title',
};
const URL_KEYS = {
    CREDIT_MONITORING: '*****',
    IDENTITY_THEFT: '*****',
    IDENTITY_RESTAURATION: '*****',
};
const DEFAULT_TRACKING = {
    type: '',
    action: '',
};
const PremiumPlusSection = ({ button, shouldDisplay, description, title, icon, companyIcon, }: {
    icon: JSX.Element;
    companyIcon: JSX.Element;
    shouldDisplay: boolean;
    description: ReactNode;
    title: string;
    button: JSX.Element;
}) => {
    return shouldDisplay ? (<section className={styles.premiumPlusSection}>
      <div>
        <div className={styles.premiumPlusIconWrapper}>{icon}</div>
      </div>
      <div>
        <h2 className={styles.premiumPlusTitle}>
          {title}
          <span className={styles.premiumPlusTitleIcon}>{companyIcon}</span>
        </h2>
        <div className={styles.premiumPlusDescription}>{description}</div>

        {button}
      </div>
    </section>) : null;
};
export const PremiumPlus = () => {
    const { translate } = useTranslate();
    const premiumStatus = usePremiumStatus();
    function shouldDisplayCapability(capability: keyof Capabilities) {
        if (premiumStatus.status === DataStatus.Success) {
            return !!premiumStatus.data.capabilities?.[capability]?.enabled;
        }
        return false;
    }
    return (<PersonalDataSectionView>
      <Header sx={{ marginTop: '16px' }} startWidgets={() => (<Heading sx={{ fontWeight: '700' }}>
            {translate(I18N_KEYS.TITLE)}
          </Heading>)} endWidget={<>
            <HeaderAccountMenu />
            <NotificationsDropdown />
          </>}/>
      <div className={styles.rootContainer}>
        <div className={styles.premiumPlusContainer}>
          <PremiumPlusSection icon={<CreditMonitoringIcon size={52}/>} companyIcon={TransunionIcon} description={translate.markup(I18N_KEYS.CREDIT_MONITORING_DESCRIPTION)} title={translate(I18N_KEYS.CREDIT_MONITORING_TITLE)} shouldDisplay={shouldDisplayCapability('creditMonitoring')} button={<Button type="button" nature="secondary" onClick={() => openDashlaneUrl(URL_KEYS.CREDIT_MONITORING, DEFAULT_TRACKING)}>
                {translate(I18N_KEYS.CREDIT_MONITORING_BUTTON)}
              </Button>}/>

          <PremiumPlusSection icon={<IdentityTheftIcon size={47}/>} companyIcon={AigIcon} description={translate.markup(I18N_KEYS.IDENTITY_THEFT_DESCRIPTION)} title={translate(I18N_KEYS.IDENTITY_THEFT_TITLE)} shouldDisplay={shouldDisplayCapability('identityTheftProtection')} button={<Button type="button" nature="secondary" onClick={() => openDashlaneUrl(URL_KEYS.IDENTITY_THEFT, DEFAULT_TRACKING)}>
                {translate(I18N_KEYS.IDENTITY_THEFT_BUTTON)}
              </Button>}/>

          <PremiumPlusSection icon={<IdentityRestorationIcon size={52}/>} companyIcon={TransunionIcon} description={translate.markup(I18N_KEYS.IDENTITY_RESTAURATION_DESCRIPTION)} title={translate(I18N_KEYS.IDENTITY_RESTAURATION_TITLE)} shouldDisplay={shouldDisplayCapability('identityRestoration')} button={<Button type="button" nature="secondary" onClick={() => openDashlaneUrl(URL_KEYS.IDENTITY_RESTAURATION, DEFAULT_TRACKING)}>
                {translate(I18N_KEYS.IDENTITY_RESTAURATION_BUTTON)}
              </Button>}/>
        </div>
      </div>
    </PersonalDataSectionView>);
};
