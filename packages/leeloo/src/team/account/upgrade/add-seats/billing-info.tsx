import { jsx } from '@dashlane/design-system';
import { LocaleFormat } from 'libs/i18n/helpers';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
const I18N_KEYS = {
    PREMIUM_BILLING_CYCLE_INFO: 'team_account_teamplan_upgrade_premium_billing_cycle_info',
};
interface BillingInfoProps {
    nextBillingDate: Date;
    daysLeftInBillingCycle: number;
}
export const BillingCycleInfo = ({ nextBillingDate, daysLeftInBillingCycle, }: BillingInfoProps) => {
    const { translate } = useTranslate();
    let displayedText = null;
    if (nextBillingDate) {
        displayedText = translate(I18N_KEYS.PREMIUM_BILLING_CYCLE_INFO, {
            count: daysLeftInBillingCycle,
            nextBillingDate: translate.shortDate(nextBillingDate, LocaleFormat.LL),
        });
    }
    if (!displayedText) {
        return null;
    }
    return <div className={styles.billingCycle}>{displayedText}</div>;
};
