import { Fragment, useState } from 'react';
import { Button, Infobox, jsx } from '@dashlane/design-system';
import { Link } from '@dashlane/ui-components';
import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { confidentialSSOApi, InferredSsoState, } from '@dashlane/sso-scim-contracts';
import { CONFIDENTIAL_SSO_LIMITATIONS } from 'team/urls';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { CreateMarkup } from 'team/settings/nitro-sso/react-markdown-wrapper';
import { SCIMPaywall } from 'team/settings/directory-sync/scim-provisioning/scim-paywall';
import { ClearSettingsConfirmationDialog } from './clear-settings-confirmation-dialog';
const NITRO_LIMITATIONS_VALUES = {
    INFOBOX_TITLE: 'SCIM provisioning is not currently supported by Confidential SSO',
    INFOBOX_DESCRIPTION: "If you plan to set up both SCIM and single sign-on (SSO), you'll need to use the self-hosted option. " +
        'Both SCIM and self-hosted SSO require the encryption service you configure and host yourself on AWS or Azure.',
    INFOBOX_CTA: 'Learn more',
};
const CLEAR_NITRO_SETUP_VALUES = {
    INFOBOX_TITLE: 'To use SCIM, clear Confidential SSO setup',
    INFOBOX_DESCRIPTION: 'If you want to use SCIM, select **Clear setup** to erase your progress in Dashlane. Make sure to also delete your progress in your IdP.',
    INFOBOX_CTA: 'Clear setup',
};
const CONFIRM_CLEAR_SETUP_VALUES = {
    DIALOG_TITLE: 'Are you sure?',
    DIALOG_BODY: 'This action can’t be undone.',
};
interface SCIMInfoboxProps {
    isScimEnabled: boolean | null;
    isSCIMCapable: boolean | null;
    isTrialOrGracePeriod?: boolean;
    onSetupClear?: () => Promise<void>;
    showPaywall?: boolean;
}
export const SCIMInfobox = ({ isScimEnabled, isSCIMCapable, isTrialOrGracePeriod, onSetupClear, showPaywall, }: SCIMInfoboxProps) => {
    const [showClearSettingsConfirmation, setShowClearSettingsConfirmation] = useState(false);
    const { teamId } = useTeamSpaceContext();
    const { clearSettings, initSsoProvisioning } = useModuleCommands(confidentialSSOApi);
    const { data: ssoState, status: ssoStateStatus } = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    if (ssoStateStatus !== DataStatus.Success) {
        return null;
    }
    const { global: { inferredSsoState }, } = ssoState;
    if (inferredSsoState === InferredSsoState.enum.NitroComplete) {
        throw new Error('Invalid state: cannot access SCIM if the team is using Confidential SSO until the enclave supports SCIM.');
    }
    if (isSCIMCapable === false &&
        showPaywall &&
        isTrialOrGracePeriod !== undefined) {
        return <SCIMPaywall isTrialOrGracePeriod={isTrialOrGracePeriod}/>;
    }
    if (inferredSsoState === InferredSsoState.enum.NitroIncomplete &&
        !showPaywall) {
        const clearCallback = async () => {
            await clearSettings();
            await initSsoProvisioning({ teamId: `${teamId}` });
            await onSetupClear?.();
        };
        return (<>
        {showClearSettingsConfirmation ? (<ClearSettingsConfirmationDialog onClose={() => setShowClearSettingsConfirmation(false)} onConfirm={clearCallback} titleText={CONFIRM_CLEAR_SETUP_VALUES.DIALOG_TITLE} bodyText={CONFIRM_CLEAR_SETUP_VALUES.DIALOG_BODY}/>) : null}
        <Infobox mood="neutral" size="large" title={CLEAR_NITRO_SETUP_VALUES.INFOBOX_TITLE} description={<CreateMarkup markdownValue={CLEAR_NITRO_SETUP_VALUES.INFOBOX_DESCRIPTION}/>} actions={[
                <Button key="clear" onClick={() => setShowClearSettingsConfirmation(true)}>
              {CLEAR_NITRO_SETUP_VALUES.INFOBOX_CTA}
            </Button>,
            ]}/>
      </>);
    }
    if (inferredSsoState !== InferredSsoState.enum.SelfHostedComplete &&
        isScimEnabled === false &&
        !showPaywall) {
        return (<Infobox mood="neutral" size="large" title={NITRO_LIMITATIONS_VALUES.INFOBOX_TITLE} description={NITRO_LIMITATIONS_VALUES.INFOBOX_DESCRIPTION} actions={[
                <Link key="learn-more" href={CONFIDENTIAL_SSO_LIMITATIONS} target="_blank" rel="noopener noreferrer">
            <Button onClick={() => { }}>
              {NITRO_LIMITATIONS_VALUES.INFOBOX_CTA}
            </Button>
          </Link>,
            ]}/>);
    }
    return null;
};
