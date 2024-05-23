import { Button, Infobox, jsx, ThemeUIStyleObject, } from '@dashlane/design-system';
import { ClickOrigin, Button as HermesButton, UserClickEvent, } from '@dashlane/hermes';
import { useFeatureFlip } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { assertUnreachable } from 'libs/assert-unreachable';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { useCapabilitiesDisabled } from 'libs/carbon/hooks/useCapabilities';
import { usePasswordLimitPaywall } from 'libs/paywall/paywallContext';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { openUrl } from 'libs/external-urls';
import { useMultiselectContext } from 'webapp/credentials/list/multi-select/multi-select-context';
export enum UpgradeNoticeType {
    Credentials = 'credentials',
    SecureNotes = 'secureNotes',
    SharingLimit = 'sharingLimit'
}
interface UpgradeNoticeProps {
    customSx?: ThemeUIStyleObject;
    noticeType: UpgradeNoticeType;
}
const I18N_KEYS = {
    PASSWORD_LIMIT_TITLE: 'webapp_paywall_password_limit_banner_title',
    PASSWORD_LIMIT_SUBTITLE: 'webapp_paywall_password_limit_banner_subtitle',
    PASSWORD_LIMIT_BUTTON: 'webapp_paywall_password_limit_banner_cta',
    PASSWORD_NEAR_LIMIT: 'webapp_paywall_password_near_limit_banner',
    SECURE_NOTES: 'webapp_paywall_secure_note_banner_markup',
    SHARING_LIMIT: 'webapp_paywall_sharing_limit_banner_markup',
};
export const UpgradeNoticeBanner = ({ noticeType, customSx = {}, }: UpgradeNoticeProps) => {
    const accountInfo = useAccountInfo();
    const usePasswordLimitResult = usePasswordLimitPaywall();
    const hasB2CPhase2FFEnabled = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.B2CRestrictPasswordFreePlanPhase2);
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const { selectedItems } = useMultiselectContext();
    const goPremiumUrl = routes.userGoPremium(accountInfo?.subscriptionCode, 'yearly');
    const canShowSecureNotesBanner = useCapabilitiesDisabled(['secureNotes']);
    const isBannerPasswordLimitReached = !usePasswordLimitResult.isLoading &&
        usePasswordLimitResult.shouldShowAtOrOverLimitContent;
    const handleUpgradeToPremium = () => {
        void logEvent(new UserClickEvent({
            clickOrigin: isBannerPasswordLimitReached
                ? ClickOrigin.BannerPasswordLimitReached
                : ClickOrigin.BannerPasswordLimitCloseToBeReached,
            button: HermesButton.BuyDashlane,
        }));
        openUrl(goPremiumUrl);
    };
    const getContent = () => {
        switch (noticeType) {
            case UpgradeNoticeType.Credentials:
                if (usePasswordLimitResult.isLoading) {
                    return null;
                }
                if (usePasswordLimitResult.shouldShowAtOrOverLimitContent) {
                    return translate(I18N_KEYS.PASSWORD_LIMIT_TITLE);
                }
                if (!!hasB2CPhase2FFEnabled &&
                    usePasswordLimitResult.shouldShowNearLimitContent &&
                    usePasswordLimitResult.passwordsLeft) {
                    return translate(I18N_KEYS.PASSWORD_NEAR_LIMIT, {
                        count: usePasswordLimitResult.passwordsLeft,
                        passwordLimit: 25,
                    });
                }
                return null;
            case UpgradeNoticeType.SecureNotes:
                if (canShowSecureNotesBanner) {
                    return translate.markup(I18N_KEYS.SECURE_NOTES, { link: goPremiumUrl }, { linkTarget: '_blank' });
                }
                return null;
            case UpgradeNoticeType.SharingLimit:
                return null;
            default:
                assertUnreachable(noticeType);
        }
    };
    const content = getContent();
    if (!content ||
        usePasswordLimitResult.isLoading ||
        selectedItems?.length > 0) {
        return null;
    }
    return (<Infobox title={content} size="large" icon="FeedbackWarningOutlined" mood={usePasswordLimitResult.shouldShowNearLimitContent ? 'brand' : 'warning'} description={usePasswordLimitResult.shouldShowAtOrOverLimitContent
            ? translate(I18N_KEYS.PASSWORD_LIMIT_SUBTITLE)
            : null} actions={[
            <Button key={translate(I18N_KEYS.PASSWORD_LIMIT_BUTTON)} icon="PremiumOutlined" layout="iconLeading" onClick={handleUpgradeToPremium}>
          {translate(I18N_KEYS.PASSWORD_LIMIT_BUTTON)}
        </Button>,
        ]} sx={customSx}/>);
};
