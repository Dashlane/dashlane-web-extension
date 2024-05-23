import { ClickOrigin, Button as HermesButton, UserClickEvent, } from '@dashlane/hermes';
import { Button, Infobox, jsx } from '@dashlane/design-system';
import { GET_PREMIUM_URL, openExternalUrl } from 'libs/externalUrls';
import useTranslate from 'libs/i18n/useTranslate';
import { useSubscriptionCode } from 'libs/api';
import { useShowPasswordLimit } from 'libs/hooks/use-show-password-limit';
import { logEvent } from 'libs/logs/logEvent';
const I18N_KEYS = {
    PASSWORD_LIMIT_ALMOST_REACHED_TITLE: 'tab/all_items/password_limit_almost_reached_title',
    UPGRADE_TO_PREMIUM: 'tab/all_items/password_limit_almost_reached_cta',
};
export const PasswordLimitAlmostReachedAlert = () => {
    const { translate } = useTranslate();
    const subscriptionCode = useSubscriptionCode();
    const passwordLimit = useShowPasswordLimit();
    if (passwordLimit === null || !passwordLimit.passwordsLeft) {
        return null;
    }
    const goToCheckout = () => {
        const buyDashlaneLink = `${GET_PREMIUM_URL}?subCode=${subscriptionCode ?? ''}`;
        void logEvent(new UserClickEvent({
            clickOrigin: ClickOrigin.BannerPasswordLimitCloseToBeReached,
            button: HermesButton.BuyDashlane,
        }));
        void openExternalUrl(buyDashlaneLink);
    };
    return (<Infobox sx={{ margin: '8px' }} title={translate(I18N_KEYS.PASSWORD_LIMIT_ALMOST_REACHED_TITLE, {
            count: passwordLimit.passwordsLeft,
        })} mood="brand" size="large" icon="FeedbackInfoOutlined" actions={[
            <Button key={translate(I18N_KEYS.UPGRADE_TO_PREMIUM)} size="small" mood="warning" intensity="catchy" onClick={goToCheckout} icon="PremiumOutlined" layout="iconLeading">
          {translate(I18N_KEYS.UPGRADE_TO_PREMIUM)}
        </Button>,
        ]}/>);
};
