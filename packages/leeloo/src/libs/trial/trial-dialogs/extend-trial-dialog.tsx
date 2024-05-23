import { useEffect } from 'react';
import { Dialog, jsx, Paragraph } from '@dashlane/design-system';
import { CallToAction, PageView, UserCallToActionEvent, } from '@dashlane/hermes';
import { useModuleCommands } from '@dashlane/framework-react';
import { teamAdminNotificationsApi } from '@dashlane/team-admin-contracts';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { openUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { BUSINESS_BUY } from 'team/urls';
import { DialogDescriptionItem } from './items/description-item';
const I18N_KEYS = {
    CLOSE: '_common_dialog_dismiss_button',
    DIALOG_TITLE_BUSINESS: 'team_dashboard_extend_trial_dialog_title_business',
    DIALOG_TITLE_TEAM: 'team_dashboard_extend_trial_dialog_title_team',
    DIALOG_SUBTITLE: 'team_dashboard_extend_trial_dialog_subtitle',
    SSO_ITEM_TITLE: 'team_dashboard_extend_trial_dialog_sso_title',
    SSO_ITEM_SUBTITLE: 'team_dashboard_extend_trial_dialog_sso_subtitle',
    FAMILY_AND_FRIENDS_ITEM_TITLE: 'team_dashboard_extend_trial_dialog_family_friends_title',
    FAMILY_AND_FRIENDS_ITEM_SUBTITLE: 'team_dashboard_extend_trial_dialog_family_friends_subtitle',
    CORE_FEATURES_ITEM_TITLE: 'team_dashboard_extend_trial_dialog_core_features_title',
    CORE_FEATURES_ITEM_SUBTITLE: 'team_dashboard_extend_trial_dialog_core_features_subtitle',
    VPN_ITEM_TITLE: 'team_dashboard_extend_trial_dialog_vpn_title',
    VPN_ITEM_SUBTITLE: 'team_dashboard_extend_trial_dialog_vpn_subtitle',
    EXTEND_TRIAL_BUTTON: 'team_dashboard_extend_trial_button',
    BUY_DASHLANE_BUTTON: 'team_dashboard_buy_dashlane_button',
};
interface Props {
    isOpen: boolean;
    isTeamPlan: boolean;
    handleClose: () => void;
    handleExtendTrial: () => void;
}
export const ExtendTrialDialog = ({ isOpen, handleClose, handleExtendTrial, isTeamPlan, }: Props) => {
    const { translate } = useTranslate();
    const accountInfo = useAccountInfo();
    const adminNotificationCommands = useModuleCommands(teamAdminNotificationsApi);
    const buyDashlaneLink = `${BUSINESS_BUY}?plan=${isTeamPlan ? 'team' : 'business'}&subCode=${accountInfo?.subscriptionCode}`;
    useEffect(() => {
        if (isOpen) {
            logPageView(PageView.TacModalTrialExpiresToday);
        }
    }, [isOpen]);
    const handleBuyDashlane = () => {
        logEvent(new UserCallToActionEvent({
            callToActionList: [
                CallToAction.ExtendTrial,
                CallToAction.BuyDashlane,
                CallToAction.Dismiss,
            ],
            chosenAction: CallToAction.BuyDashlane,
            hasChosenNoAction: false,
        }));
        adminNotificationCommands.markOfferToExtendFreeTrialSeen();
        openUrl(buyDashlaneLink);
    };
    return (<Dialog isOpen={isOpen} onClose={handleClose} title={translate(isTeamPlan
            ? I18N_KEYS.DIALOG_TITLE_TEAM
            : I18N_KEYS.DIALOG_TITLE_BUSINESS)} closeActionLabel={translate(I18N_KEYS.CLOSE)} actions={{
            primary: {
                children: translate(I18N_KEYS.BUY_DASHLANE_BUTTON),
                onClick: handleBuyDashlane,
            },
            secondary: {
                children: translate(I18N_KEYS.EXTEND_TRIAL_BUTTON),
                onClick: handleExtendTrial,
            },
        }}>
      <Paragraph sx={{ marginBottom: '25px' }}>
        {translate(I18N_KEYS.DIALOG_SUBTITLE)}
      </Paragraph>

      <DialogDescriptionItem iconName={'ToolsOutlined'} title={isTeamPlan
            ? I18N_KEYS.CORE_FEATURES_ITEM_TITLE
            : I18N_KEYS.SSO_ITEM_TITLE} subtitle={isTeamPlan
            ? I18N_KEYS.CORE_FEATURES_ITEM_SUBTITLE
            : I18N_KEYS.SSO_ITEM_SUBTITLE}/>
      <DialogDescriptionItem iconName={isTeamPlan ? 'FeatureVpnOutlined' : 'GroupOutlined'} title={isTeamPlan
            ? I18N_KEYS.VPN_ITEM_TITLE
            : I18N_KEYS.FAMILY_AND_FRIENDS_ITEM_TITLE} subtitle={isTeamPlan
            ? I18N_KEYS.VPN_ITEM_SUBTITLE
            : I18N_KEYS.FAMILY_AND_FRIENDS_ITEM_SUBTITLE}/>
    </Dialog>);
};
