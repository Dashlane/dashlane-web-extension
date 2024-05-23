import { Button, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
export const I18N_KEYS = {
    BUY_MORE: 'team_account_teamplan_buy_more',
    BUY_DASHLANE_TRIAL_ENDED: 'team_account_teamplan_trial_ended_buy_dashlane',
    CANNOT_ADD_SEATS: 'team_account_teamplan_hint_cannot_add_seats',
    UPGRADE_BUTTON: 'team_account_teamplan_upgrade_button',
};
interface Props {
    isFreeTrial: boolean;
    isGracePeriod: boolean;
    isStarter: boolean;
    isDiscontinuedTrial: boolean;
    onClick: () => void;
    licenseCount: number;
}
export const ActionableButton = ({ isFreeTrial, isGracePeriod, isStarter, isDiscontinuedTrial, onClick, licenseCount, }: Props) => {
    const { translate } = useTranslate();
    const isPurchaseEnabled = !APP_PACKAGED_FOR_FIREFOX;
    if (isStarter) {
        return null;
    }
    if (isGracePeriod && !isFreeTrial) {
        return (<Button mood="neutral" intensity="quiet" title={translate(I18N_KEYS.CANNOT_ADD_SEATS)} disabled>
        {translate(I18N_KEYS.BUY_MORE)}
      </Button>);
    }
    if (isDiscontinuedTrial) {
        return (<Button mood="brand" intensity="catchy" onClick={onClick}>
        {translate(I18N_KEYS.BUY_DASHLANE_TRIAL_ENDED)}
      </Button>);
    }
    if (isFreeTrial) {
        return (<Button mood="neutral" intensity="quiet" onClick={onClick} disabled={!isPurchaseEnabled}>
        {translate(I18N_KEYS.UPGRADE_BUTTON)}
      </Button>);
    }
    else {
        return (<Button mood="neutral" intensity="quiet" onClick={onClick} disabled={!licenseCount}>
        {translate(I18N_KEYS.BUY_MORE)}
      </Button>);
    }
};
