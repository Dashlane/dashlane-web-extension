import { Link } from 'libs/router';
import QRCode from 'qrcode.react';
import classnames from 'classnames';
import { BackIcon, colors, InfoCircleIcon, jsx, MobileIcon, Tooltip, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import phone from 'webapp/onboarding/onboarding-card/images/phone.svg';
import scanner from 'webapp/onboarding/onboarding-card/images/scanner.svg';
import dashlaneIcon from 'webapp/onboarding/onboarding-card/images/dashlaneLogo.svg';
import { DASHLANE_DOWNLOAD_EXTENSION_URL } from 'webapp/urls';
import containerStyles from '../../styles.css';
import styles from './styles.css';
import { logPageView } from 'libs/logs/logEvent';
import { PageView } from '@dashlane/hermes';
import { useEffect } from 'react';
const infoCircleIcon = (<InfoCircleIcon color={colors.dashGreen00} size={16} viewBox="0 2 20 20"/>);
const mobileIcon = (<MobileIcon color={colors.dashGreen02} size={24} viewBox="0 2 40 40"/>);
const backArrowIcon = (<BackIcon color={colors.dashGreen00} size={20} viewBox="0 2 20 20"/>);
const qrCodeProperties = {
    value: `${DASHLANE_DOWNLOAD_EXTENSION_URL}?utm_source=saexqrcode`,
    size: 120,
};
export const ScanQRCode = () => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const tooltipContent = `${translate('web_onboarding_card_add_mobile_warning_hover_pt_1')}
  ${translate('web_onboarding_card_add_mobile_warning_hover_pt_2')}`;
    const hoverToolTip = (<Tooltip placement="top" content={tooltipContent} sx={{ maxWidth: '270px' }}>
      <div className={styles.hoverMessage}>
        {translate('web_onboarding_card_add_mobile_warning_hover')}
      </div>
    </Tooltip>);
    useEffect(() => {
        logPageView(PageView.HomeOnboardingChecklistAddDevice);
    }, []);
    return (<div className={containerStyles.container}>
      <div className={containerStyles.routeContainer}>
        <Link to={routes.userOnboarding} className={containerStyles.arrowBtnContainer}>
          {backArrowIcon}
        </Link>
        <div className={styles.mobileIcon}>{mobileIcon}</div>
        <h2 className={containerStyles.actionText}>
          {translate('web_onboarding_card_add_mobile')}
        </h2>
      </div>
      <div className={containerStyles.subContainer}>
        <h1 className={containerStyles.title}>
          {translate('web_onboarding_card_add_mobile_title')}
        </h1>
        <div className={styles.qrCodeContainer}>
          <img className={styles.phone} src={phone}/>
          <img className={styles.scanner} src={scanner}/>
          <div className={styles.qrCode}>
            <div className={styles.qrCodeSpan}>
              <QRCode data-testid="qr-code" renderAs="svg" {...qrCodeProperties}/>
            </div>
          </div>
          <div className={styles.qrCodeCaption}>
            <p className={styles.caption}>
              {translate('web_onboarding_card_add_mobile_description')}
            </p>
            <button className={classnames(styles.iconTextContainer, styles.warningContainer)}>
              <div className={styles.infoCircleIcon}>{infoCircleIcon}</div>
              {hoverToolTip};
            </button>
          </div>
        </div>
        <h2 className={styles.findDashlane}>
          {translate('web_onboarding_card_add_mobile_find_dashlane')}
        </h2>
        <div className={styles.iconTextContainer}>
          <img className={containerStyles.dashlaneIcon} src={dashlaneIcon}/>
          <p className={styles.availableOn}>
            {translate('web_onboarding_card_add_mobile_available_on')}
          </p>
        </div>
      </div>
    </div>);
};
