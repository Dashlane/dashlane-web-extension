import React, { useEffect } from 'react';
import { Link } from 'libs/router';
import { WebOnboardingLeelooStep } from '@dashlane/communication';
import { BackIcon, colors, PasswordsIcon } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import SecondaryButton from 'libs/dashlane-style/buttons/modern/secondary';
import PrimaryButton from 'libs/dashlane-style/buttons/modern/primary';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { setOnboardingMode } from '../../../services';
import goToIcon from 'webapp/onboarding/onboarding-card/images/go-to-outlined.svg';
import containerStyles from '../../styles.css';
import styles from './styles.css';
import { logPageView } from 'libs/logs/logEvent';
import { PageView } from '@dashlane/hermes';
export interface Props {
    domainText: string;
    loginUrlText: string;
    setSelectedSite: (newValue: boolean) => void;
}
const backArrowIcon = (<BackIcon color={colors.dashGreen00} size={20} viewBox="0 2 20 20"/>);
const passwordsIcon = (<PasswordsIcon color={colors.dashGreen02} size={20} viewBox="0 0 40 40"/>);
export const ConfirmSite = ({ domainText, loginUrlText, setSelectedSite, }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const openChosenSite = () => {
        setOnboardingMode({
            activeOnboardingType: 'saveWeb',
            flowLoginCredentialOnWebSite: { domain: domainText, url: loginUrlText },
        });
    };
    const goToPreviousView = () => {
        setOnboardingMode({
            activeOnboardingType: 'saveWeb',
            leelooStep: WebOnboardingLeelooStep.SHOW_SAVE_SITES_DIALOG,
        });
        setSelectedSite(false);
    };
    useEffect(() => {
        logPageView(PageView.HomeOnboardingChecklistAddFirstLogin);
    }, []);
    return (<>
      <div className={containerStyles.routeContainer}>
        <Link to={routes.userPasswordSites} className={containerStyles.arrowBtnContainer} onClick={goToPreviousView}>
          {backArrowIcon}
        </Link>
        <div className={containerStyles.passwordsIcon}>{passwordsIcon}</div>
        <h2 className={containerStyles.actionText}>
          {translate('web_onboarding_card_add_password')}
        </h2>
      </div>
      <div className={containerStyles.subContainer}>
        <h2 className={containerStyles.title}>
          {translate('web_onboarding_card_go_to_site_title')}
        </h2>
        <p className={containerStyles.description}>
          {translate('web_onboarding_card_go_to_site_description')}
        </p>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepIcon}>1</div>
            <div className={styles.textContainer}>
              <p className={styles.mainText}>
                {translate('web_onboarding_card_go_to_site_step_1_pt_1')}
              </p>
              <p className={styles.subText}>
                {translate.markup('web_onboarding_card_go_to_site_step_1_pt_2_markup')}
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>2</div>
            <p className={styles.stepText}>
              {translate('web_onboarding_card_go_to_site_step_2')}
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>3</div>
            <p className={styles.stepText}>
              {translate.markup('web_onboarding_card_go_to_site_step_3_markup')}
            </p>
          </div>
        </div>
        <div className={styles.ctaContainer}>
          <Link to={routes.userPasswordSites}>
            <SecondaryButton label={translate('web_onboarding_card_go_back')} marginSide="right" key="button-dismiss" onClick={goToPreviousView}/>
          </Link>
          <PrimaryButton label={translate('web_onboarding_card_go_to_site_link')} icon={<img src={goToIcon}/>} onClick={openChosenSite}/>
        </div>
      </div>
    </>);
};
