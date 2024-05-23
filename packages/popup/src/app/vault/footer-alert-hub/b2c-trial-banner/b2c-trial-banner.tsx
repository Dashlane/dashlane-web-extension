import { Fragment } from 'react';
import { differenceInCalendarDays, fromUnixTime } from 'date-fns';
import { jsx } from '@dashlane/design-system';
import { Button, ClickOrigin, UserClickEvent } from '@dashlane/hermes';
import { useNodePremiumStatus, useSubscriptionCode } from 'libs/api';
import { GET_PREMIUM_URL, openExternalUrl } from 'libs/externalUrls';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { FooterAlertButton } from '../footer-alert/footer-alert-button';
const I18N_KEYS = {
    STATUS_B2C_PREMIUM_TRIAL_N_DAYS: 'tab/all_items/trial_banner/status_b2c_free_trial_n_days_markup',
    CTA_PURCHASE_FREE_TRIAL: 'tab/all_items/trial_banner/cta_purchase_free_trial',
    POST_TRIAL_EXPIRED: 'tab/all_items/trial_banner/b2c_post_trial_banner_expired',
    POST_TRIAL_BUY_DASHLANE: 'tab/all_items/trial_banner/b2c_post_trial_banner_buy_dashlane',
};
interface Props {
    isPostTrial?: boolean;
}
export const B2CTrialBanner = ({ isPostTrial = false }: Props) => {
    const { translate, translateMarkup } = useTranslate();
    const subscriptionCode = useSubscriptionCode();
    const premiumStatus = useNodePremiumStatus();
    if (!premiumStatus) {
        return null;
    }
    const endDate = premiumStatus.endDateUnix ?? 0;
    const expiredDate = premiumStatus.previousPlan?.endDateUnix ?? 0;
    const daysLeftInTrial = endDate > 0
        ? differenceInCalendarDays(fromUnixTime(endDate), new Date())
        : endDate;
    const daysAfterTrial = expiredDate > 0
        ?
            Math.abs(differenceInCalendarDays(fromUnixTime(expiredDate), new Date()))
        : expiredDate;
    const buyDashlaneLink = `${GET_PREMIUM_URL}?subCode=${subscriptionCode ?? ''}`;
    const handleClick = () => {
        void logEvent(new UserClickEvent({
            button: Button.BuyDashlane,
            clickOrigin: ClickOrigin.Banner,
        }));
        void openExternalUrl(buyDashlaneLink);
    };
    return (<>
      {premiumStatus.isTrial && (<FooterAlertButton colors={{
                backgroundColor: 'ds.container.expressive.brand.catchy.idle',
                color: 'ds.text.inverse.catchy',
            }} labelText={translateMarkup(I18N_KEYS.STATUS_B2C_PREMIUM_TRIAL_N_DAYS, { count: daysLeftInTrial })} buttonText={translate(I18N_KEYS.CTA_PURCHASE_FREE_TRIAL)} handleClick={handleClick}/>)}
      {isPostTrial && daysAfterTrial >= 1 && daysAfterTrial <= 15 && (<FooterAlertButton colors={{
                backgroundColor: 'ds.container.expressive.warning.catchy.idle',
                color: 'ds.text.inverse.catchy',
            }} labelText={translate(I18N_KEYS.POST_TRIAL_EXPIRED)} buttonText={translate(I18N_KEYS.POST_TRIAL_BUY_DASHLANE)} handleClick={handleClick}/>)}
    </>);
};
