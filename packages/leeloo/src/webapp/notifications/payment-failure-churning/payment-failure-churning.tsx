import React from 'react';
import { fromUnixTime } from 'date-fns';
import { CSSTransition } from 'react-transition-group';
import { PremiumStatusCode } from '@dashlane/communication';
import { InfoBox } from '@dashlane/ui-components';
import { openDashlaneUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { LocaleFormat } from 'libs/i18n/helpers';
import { isAccountBusiness } from 'libs/account/helpers';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { currentDateisLessThanSevenDaysBefore } from '../helpers';
import styles from './payment-failure-styles.css';
const I18N_KEYS = {
    TITLE: 'webapp_payment_failure_churning_title',
    CTA: 'webapp_payment_failure_churning_cta',
};
const PaymentFailureChurningComponent = () => {
    const { translate } = useTranslate();
    const { routes, store } = useRouterGlobalSettingsContext();
    const accountInfo = store.getState().carbon.accountInfo;
    const premiumStatus = accountInfo.premiumStatus;
    if (!premiumStatus ||
        !(premiumStatus.statusCode === PremiumStatusCode.PREMIUM ||
            premiumStatus.statusCode === PremiumStatusCode.PREMIUM_CANCELLED) ||
        !premiumStatus.endDate ||
        !premiumStatus.autoRenewalFailed ||
        !currentDateisLessThanSevenDaysBefore(premiumStatus.endDate) ||
        isAccountBusiness(premiumStatus)) {
        return null;
    }
    const formattedEndDate = translate.shortDate(fromUnixTime(premiumStatus.endDate), LocaleFormat.LL);
    const goToCheckout = (): void => {
        const trackingParams = {
            type: 'PaymentFailureToast',
            action: 'checkout',
        };
        const goPremiumUrl = routes.userGoPremium(accountInfo.subscriptionCode);
        openDashlaneUrl(goPremiumUrl, trackingParams);
    };
    return (<div className={styles.floatingNotificationsContainer}>
      <CSSTransition classNames={{
            appear: styles.appear,
            appearActive: styles.appearActive,
        }} timeout={{
            appear: 300,
            enter: 0,
            exit: 0,
        }} appear in>
        <InfoBox title={translate(I18N_KEYS.TITLE, { endDate: formattedEndDate })} size="descriptive" severity="alert" primary={goToCheckout} primaryLabel={translate(I18N_KEYS.CTA)}/>
      </CSSTransition>
    </div>);
};
export const PaymentFailureChurning = React.memo(PaymentFailureChurningComponent);
