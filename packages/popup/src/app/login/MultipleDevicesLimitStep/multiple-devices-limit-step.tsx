import * as React from 'react';
import { BackIcon, Button, colors, FlexContainer, Link, Paragraph, } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import useTranslate from 'libs/i18n/useTranslate';
import { GET_PREMIUM_URL, openExternalUrl } from 'libs/externalUrls';
import styles from 'app/login/MultipleDevicesLimitStep/styles.css';
import { getUrlGivenQuery } from 'src/libs/getUrlGivenQuery';
import { getPlanRenewalPeriodicity } from 'src/libs/premium-status.lib';
import { usePremiumStatusData } from 'src/libs/api';
import { openWebAppAndClosePopup } from 'src/app/helpers';
const I18N_KEYS = {
    TITLE: 'multiple_devices_limit_step/title',
    DESCRIPTION: 'multiple_devices_limit_step/description',
    UPGRADE: 'multiple_devices_limit_step/upgrade',
    UNLINK: 'multiple_devices_limit_step/unlink',
};
interface MultipleDevicesLimitStepProps {
    onStartOver: () => void;
    subscriptionCode: string;
}
const MultipleDevicesLimitStepComponent = ({ onStartOver, subscriptionCode, }: MultipleDevicesLimitStepProps) => {
    const { translate } = useTranslate();
    const premiumStatus = usePremiumStatusData();
    const onUpgrade = () => {
        void openExternalUrl(getUrlGivenQuery(GET_PREMIUM_URL, {
            subCode: subscriptionCode,
            utm_source: 'webapp',
            pricing: getPlanRenewalPeriodicity(premiumStatus.status === DataStatus.Success
                ? premiumStatus.data.autoRenewInfo
                : undefined),
        }));
    };
    const onUnlink = () => {
        void openWebAppAndClosePopup({ route: '/login' });
    };
    return (<div className={styles.wrapper}>
      
      <div className={styles.flexContainer}>
        <div>
          <Link className={styles.iconWrapper} onClick={onStartOver}>
            <BackIcon size={20} color={colors.white}/>
          </Link>

          
          <h1 className={styles.title}>{translate(I18N_KEYS.TITLE)}</h1>
          <Paragraph theme="dark" color={colors.dashGreen05}>
            {translate(I18N_KEYS.DESCRIPTION)}
          </Paragraph>
        </div>

        <FlexContainer flexDirection="column" gap="4">
          <Button type="button" nature="primary" size="large" theme="dark" onClick={onUpgrade}>
            {translate(I18N_KEYS.UPGRADE)}
          </Button>
          <Button nature="secondary" type="button" theme="dark" size="large" onClick={onUnlink}>
            {translate(I18N_KEYS.UNLINK)}
          </Button>
        </FlexContainer>
      </div>
    </div>);
};
export const MultipleDevicesLimitStep = React.memo(MultipleDevicesLimitStepComponent);
