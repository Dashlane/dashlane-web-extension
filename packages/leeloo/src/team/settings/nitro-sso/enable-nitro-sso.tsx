import { Fragment, useState } from 'react';
import { confidentialSSOApi, DomainVerificationStatus, } from '@dashlane/sso-scim-contracts';
import { Button, jsx, Paragraph } from '@dashlane/design-system';
import { useModuleCommands, useModuleQuery } from '@dashlane/framework-react';
import { isSuccess } from '@dashlane/framework-types';
import { AlertSeverity } from '@dashlane/ui-components';
import { SsoSetupStep } from '@dashlane/hermes';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { ConfirmDialog } from 'team/settings/confirm-dialog';
import { logNitroSSOSetupStep } from 'team/settings/sso-setup-logs';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    SECTION_HEADING: 'sso_confidential_enable_nitro_sso_section_heading',
    DESCRIPTION: 'sso_confidential_enable_nitro_sso_description',
    SUCCESS_FEEDBACK: 'sso_confidential_enable_nitro_sso_success_feedback',
    ERROR_FEEDBACK: 'sso_confidential_enable_nitro_sso_error_feedback',
    CONFIRM_DIALOG_TITLE: 'sso_confidential_enable_nitro_sso_confirm_dialog_title',
    CONFIRM_DIALOG_BODY: 'sso_confidential_enable_nitro_sso_confirm_dialog_body',
    CONFIRM_DIALOG_PRIMARY_ACTION_LABEL: 'sso_confidential_enable_nitro_sso_confirm_dialog_primary_action_label',
    BUTTON_LABEL: 'sso_confidential_enable_nitro_sso_button_label',
};
const FIELDS = {
    ENABLE_TOGGLE: 'enableSso',
};
export const EnableNitroSSO = () => {
    const { translate } = useTranslate();
    const { showAlert } = useAlert();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const ssoProvisioningState = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    const { enableSso } = useModuleCommands(confidentialSSOApi);
    const domainName = ssoProvisioningState.data?.domainSetup[0]?.domainName;
    const verificationInfo = domainName
        ? ssoProvisioningState.data?.domainVerificationInfo[domainName]
        : null;
    const formDisabled = verificationInfo?.verificationStatus !==
        DomainVerificationStatus.enum.valid;
    const enabled = ssoProvisioningState.data?.enableSSO.ssoEnabled;
    const interactionImpossible = Boolean(formDisabled || enabled);
    const enableSSO = async () => {
        const enableResponse = await enableSso();
        if (isSuccess(enableResponse)) {
            showAlert(translate(I18N_KEYS.SUCCESS_FEEDBACK), AlertSeverity.SUCCESS);
        }
        else {
            showAlert(enableResponse.error.tag, AlertSeverity.ERROR);
        }
    };
    const enableSSOClicked = () => {
        setShowConfirmDialog(true);
        logNitroSSOSetupStep({ ssoSetupStep: SsoSetupStep.TurnOnSso });
    };
    const onCancel = () => {
        setShowConfirmDialog(false);
    };
    const onConfirm = async () => {
        await enableSSO();
        logNitroSSOSetupStep({ ssoSetupStep: SsoSetupStep.CompleteSsoSetup });
        setShowConfirmDialog(false);
    };
    return (<>
      <div sx={{
            display: 'grid',
            gap: '8px',
        }}>
        <Paragraph as="h2" textStyle="ds.title.section.medium" color="ds.text.neutral.standard">
          {translate(I18N_KEYS.SECTION_HEADING)}
        </Paragraph>
        <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.standard" sx={{ mb: '4px', gridRow: '2', gridColumn: '1/1' }}>
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
        <div sx={{ justifySelf: 'end' }}>
          <Button id={FIELDS.ENABLE_TOGGLE} onClick={enableSSOClicked} disabled={interactionImpossible}>
            {translate(I18N_KEYS.BUTTON_LABEL)}
          </Button>
        </div>
      </div>
      {showConfirmDialog ? (<ConfirmDialog title={translate(I18N_KEYS.CONFIRM_DIALOG_TITLE)} body={translate(I18N_KEYS.CONFIRM_DIALOG_BODY)} primaryActionLabel={translate(I18N_KEYS.CONFIRM_DIALOG_PRIMARY_ACTION_LABEL)} onConfirm={onConfirm} onCancel={onCancel}/>) : null}
    </>);
};
