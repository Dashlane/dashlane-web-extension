import { Fragment, useEffect } from 'react';
import { Dialog, jsx, Paragraph } from '@dashlane/design-system';
import { LoadingIcon } from '@dashlane/ui-components';
import { PageView } from '@dashlane/hermes';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import useTranslate from 'libs/i18n/useTranslate';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import { logPageView } from 'libs/logs/logEvent';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { useTeamCapabilities } from 'team/settings/hooks/use-team-capabilities';
import { ContactSupportItem } from 'team/page/support/contact-support-item';
import { HorizontalDivider } from 'team/page/support/horizontal-divider';
import { handleClickPhoneSupportAction, handleClickSupportOption, handleDismissDialog, SupportOption, } from 'team/page/support/actions';
interface Props {
    onDismiss: () => void;
}
const I18N_KEYS = {
    TITLE: 'team_contact_support_dialog_title',
    DESCRIPTION: 'team_contact_support_dialog_text',
    CLOSE: '_common_dialog_dismiss_button',
    PHONE_SUPPORT_TITLE: 'team_contact_support_phone_support_title',
    PHONE_SUPPORT_SUBTITLE: 'team_contact_support_phone_support_subtitle',
    PHONE_SUPPORT_UPGRADE: 'team_contact_support_upgrade_to_business_cta',
    PHONE_SUPPORT_REQUEST_CALL: 'team_contact_support_request_call',
    SECURITY_GUIDANCE_TITLE: 'team_contact_support_security_guidance_title',
    SECURITY_GUIDANCE_SUBTITLE: 'team_contact_support_security_guidance_subtitle',
    SECURITY_GUIDANCE_REQUEST_DEMO: 'team_contact_support_request_demo',
    TRAINING_TITLE: 'team_contact_support_training_title',
    TRAINING_SUBTITLE: 'team_contact_support_training_subtitle',
    REGISTER_FOR_WEBINAR: 'team_contact_support_register_for_webinar',
    HELP_CUSTOMER_SUPPORT_TITLE: 'team_contact_support_help_customer_support_title',
    HELP_CUSTOMER_SUPPORT_SUBTITLE: 'team_contact_support_help_customer_support_subtitle',
    SEND_MESSAGE_TO_SUPPORT: 'team_contact_support_send_message',
};
export const ContactSupportDialog = ({ onDismiss }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const accountInfo = useAccountInfo();
    const teamTrialStatus = useTeamTrialStatus();
    const capabilities = useTeamCapabilities();
    const isLoading = capabilities === null || teamTrialStatus === null;
    const hasPhoneSupportCapability = capabilities?.phoneSupport.enabled ?? false;
    useEffect(() => {
        logPageView(PageView.TacModalContactSupport);
    }, []);
    return (<Dialog isOpen onClose={() => handleDismissDialog(onDismiss, hasPhoneSupportCapability)} closeActionLabel={translate(I18N_KEYS.CLOSE)} title={translate(I18N_KEYS.TITLE)}>
      {isLoading ? (<Paragraph sx={{ textAlign: 'center' }}>
          <LoadingIcon color="primaries.5" size={44}/>
        </Paragraph>) : (<>
          <Paragraph sx={{ marginBottom: '16px' }}>
            {translate(I18N_KEYS.DESCRIPTION)}
          </Paragraph>
          <div sx={{ gap: '8px' }}>
            <ContactSupportItem title={translate(I18N_KEYS.PHONE_SUPPORT_TITLE)} description={translate(I18N_KEYS.PHONE_SUPPORT_SUBTITLE)} iconName="ItemPhoneHomeOutlined" button={{
                content: translate(hasPhoneSupportCapability
                    ? I18N_KEYS.PHONE_SUPPORT_REQUEST_CALL
                    : I18N_KEYS.PHONE_SUPPORT_UPGRADE),
                onClick: () => handleClickPhoneSupportAction(hasPhoneSupportCapability, routes, teamTrialStatus?.isFreeTrial, teamTrialStatus?.isGracePeriod, accountInfo?.subscriptionCode),
                isUpgradeButton: !hasPhoneSupportCapability,
                isRoleLink: hasPhoneSupportCapability ||
                    teamTrialStatus?.isFreeTrial ||
                    teamTrialStatus?.isGracePeriod,
            }}/>
            <HorizontalDivider />
            <ContactSupportItem title={translate(I18N_KEYS.SECURITY_GUIDANCE_TITLE)} description={translate(I18N_KEYS.SECURITY_GUIDANCE_SUBTITLE)} iconName="ProtectionOutlined" button={{
                content: translate(I18N_KEYS.SECURITY_GUIDANCE_REQUEST_DEMO),
                onClick: () => handleClickSupportOption(SupportOption.SECURITY_GUIDANCE, hasPhoneSupportCapability),
                isRoleLink: true,
            }}/>
            <HorizontalDivider />
            <ContactSupportItem title={translate(I18N_KEYS.TRAINING_TITLE)} description={translate(I18N_KEYS.TRAINING_SUBTITLE)} iconName="AccountSettingsOutlined" button={{
                content: translate(I18N_KEYS.REGISTER_FOR_WEBINAR),
                onClick: () => handleClickSupportOption(SupportOption.TRAINING, hasPhoneSupportCapability),
                isRoleLink: true,
            }}/>
            <HorizontalDivider />
            <ContactSupportItem title={translate(I18N_KEYS.HELP_CUSTOMER_SUPPORT_TITLE)} description={translate(I18N_KEYS.HELP_CUSTOMER_SUPPORT_SUBTITLE)} iconName="ItemEmailOutlined" button={{
                content: translate(I18N_KEYS.SEND_MESSAGE_TO_SUPPORT),
                onClick: () => handleClickSupportOption(SupportOption.SEND_MESSAGE, hasPhoneSupportCapability),
                isRoleLink: true,
            }}/>
          </div>
        </>)}
    </Dialog>);
};
