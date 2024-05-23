import { jsx, ThemeUIStyleObject } from '@dashlane/design-system';
import { Button, ClickOrigin, UserClickEvent } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { openExternalUrl } from 'libs/externalUrls';
import { logEvent } from 'libs/logs/logEvent';
import { FooterAlertButton } from '../footer-alert/footer-alert-button';
const I18N_KEYS = {
    STATUS_BUSINESS_FREE_TRIAL_N_DAYS: 'tab/all_items/trial_banner/status_business_free_trial_n_days_markup',
    STATUS_TEAM_FREE_TRIAL_N_DAYS: 'tab/all_items/trial_banner/status_team_free_trial_n_days_markup',
    CTA_PURCHASE_FREE_TRIAL: 'tab/all_items/trial_banner/cta_purchase_free_trial',
};
const colors: Partial<ThemeUIStyleObject> = {
    backgroundColor: 'ds.container.expressive.brand.quiet.idle',
    color: 'ds.text.brand.standard',
};
interface Props {
    isBusiness: boolean;
    daysLeftInTrial?: number;
    url: string;
}
export const EarlyTrialBanner = ({ daysLeftInTrial, isBusiness, url, }: Props) => {
    const { translate, translateMarkup } = useTranslate();
    const statusCopy = translateMarkup(isBusiness
        ? I18N_KEYS.STATUS_BUSINESS_FREE_TRIAL_N_DAYS
        : I18N_KEYS.STATUS_TEAM_FREE_TRIAL_N_DAYS, { count: daysLeftInTrial });
    const ctaCopy = translate(I18N_KEYS.CTA_PURCHASE_FREE_TRIAL);
    const handleClick = () => {
        logEvent(new UserClickEvent({
            button: Button.BuyDashlane,
            clickOrigin: ClickOrigin.Banner,
        }));
        void openExternalUrl(url);
    };
    return (<FooterAlertButton colors={colors} labelText={statusCopy} buttonText={ctaCopy} handleClick={handleClick}/>);
};
