import * as React from 'react';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import PrimaryButton from 'libs/dashlane-style/buttons/modern/primary';
import { openDashlaneUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import illustrationImg from './images/devices-sync.svg';
import styles from './styles.css';
const I18N_KEYS = {
    HEADER: 'webapp_upsell_header',
    INSTRUCTIONS_INTRODUCTION: 'webapp_upsell_instructions_introduction',
    SYNCHRONIZATION: 'webapp_upsell_instructions_bulletpoint_synchronisation_markup',
    BULLETPOINT_BACKUP: 'webapp_upsell_instructions_bulletpoint_backup_markup',
    BULLETPOINT_SHARING: 'webapp_upsell_instructions_bulletpoint_sharing_markup',
    BULLETPOINT_SUPPORT: 'webapp_upsell_instructions_bulletpoint_support_markup',
    UPSELL_CTA: 'webapp_upsell_cta',
};
const GoPremiumButton = (props: {
    label: string;
    target: string;
}) => {
    const onClick = () => {
        const trackingParams = {
            type: 'upsellScreen',
            action: 'goPremium',
        };
        openDashlaneUrl(props.target, trackingParams);
    };
    return (<PrimaryButton classNames={[styles.goPremiumCta]} onClick={onClick} label={props.label}/>);
};
const PanelInstructions = ({ target }: {
    target: string;
}) => {
    const { translate } = useTranslate();
    return (<div className={styles.panelText}>
      <h1>{translate(I18N_KEYS.HEADER)}</h1>

      <p>{translate(I18N_KEYS.INSTRUCTIONS_INTRODUCTION)}</p>

      <ul>
        <li>{translate.markup(I18N_KEYS.SYNCHRONIZATION)}</li>
        <li>{translate.markup(I18N_KEYS.BULLETPOINT_BACKUP)}</li>
        <li>{translate.markup(I18N_KEYS.BULLETPOINT_SHARING)}</li>
        <li>{translate.markup(I18N_KEYS.BULLETPOINT_SUPPORT)}</li>
      </ul>

      <GoPremiumButton label={translate(I18N_KEYS.UPSELL_CTA)} target={target}/>
    </div>);
};
const PanelIllustration = () => (<div className={styles.panelIllustration}>
    <img src={illustrationImg} alt=""/>
  </div>);
const Upsell = () => {
    const { routes } = useRouterGlobalSettingsContext();
    const accountInfo = useAccountInfo();
    const goPremiumUrl = routes.userGoPremium(accountInfo?.subscriptionCode);
    return (<div className={styles.panel}>
      <div className={styles.panelContent}>
        <div className={styles.container}>
          <PanelInstructions target={goPremiumUrl}/>
          <PanelIllustration />
        </div>
      </div>
    </div>);
};
export { Upsell };
