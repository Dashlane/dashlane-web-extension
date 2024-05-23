import { useState } from 'react';
import { confidentialSSOApi, DomainVerificationStatus, } from '@dashlane/sso-scim-contracts';
import { Heading, jsx, Paragraph } from '@dashlane/design-system';
import { useModuleCommands, useModuleQuery } from '@dashlane/framework-react';
import { isSuccess } from '@dashlane/framework-types';
import { Alert, AlertSeverity, AlertSize } from '@dashlane/ui-components';
import { DisabledButtonWithTooltip } from 'libs/dashlane-style/buttons/DisabledButtonWithTooltip';
import { logNitroSSOSetupStep } from 'team/settings/sso-setup-logs';
import { SsoSetupStep, TestSsoResponse } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    SECTION_HEADING: 'sso_confidential_test_nitro_sso_section_heading',
    DESCRIPTION: 'sso_confidential_test_nitro_sso_description',
    BUTTON_LABEL: 'sso_confidential_test_nitro_sso_button_label',
    SUCCESS_FEEDBACK: 'sso_confidential_test_nitro_sso_success_feedback',
    ERROR_FEEDBACK: 'sso_confidential_test_nitro_sso_error_feedback',
    NO_EXTENSION_FEEDBACK: 'sso_confidential_test_nitro_sso_no_extension_feedback',
};
export const TestNitroSSO = () => {
    const { translate } = useTranslate();
    const [loading, setLoading] = useState(false);
    const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
    const [showErrorFeedback, setShowErrorFeedback] = useState(false);
    const { testLoginUserWithEnclaveSSO } = useModuleCommands(confidentialSSOApi);
    const ssoState = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    const domainName = ssoState.data?.domainSetup[0]?.domainName ?? '';
    const onTestSsoClicked = async () => {
        setLoading(true);
        try {
            const result = await testLoginUserWithEnclaveSSO({
                domainName,
            });
            const success = isSuccess(result);
            logNitroSSOSetupStep({
                ssoSetupStep: SsoSetupStep.TestSsoConnection,
                testSsoResponse: success
                    ? TestSsoResponse.Success
                    : TestSsoResponse.Failure,
            });
            setShowSuccessFeedback(success);
            setShowErrorFeedback(!success);
        }
        finally {
            setLoading(false);
        }
    };
    const onCloseSuccessFeedback = () => {
        setShowSuccessFeedback(false);
    };
    const onCloseErrorFeedback = () => {
        setShowErrorFeedback(false);
    };
    const testSsoDisabled = ssoState.data?.domainVerificationInfo[domainName]?.verificationStatus !==
        DomainVerificationStatus.enum?.valid || !APP_PACKAGED_IN_EXTENSION;
    return (<div sx={{
            display: 'grid',
            gridTemplateColumns: 'auto',
            gridAutoRows: 'auto',
            gap: '8px',
        }}>
      
      <div>
        <Heading as="h2" textStyle="ds.title.section.medium" color="ds.text.neutral.standard" sx={{ mb: '8px' }}>
          {translate(I18N_KEYS.SECTION_HEADING)}
        </Heading>
        <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.standard">
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
      </div>
      <div sx={{ justifySelf: 'end', gridColumn: '2' }}>
        <DisabledButtonWithTooltip disabled={testSsoDisabled} onClick={onTestSsoClicked} loading={loading} content={translate(I18N_KEYS.NO_EXTENSION_FEEDBACK)} neverShowTooltip={APP_PACKAGED_IN_EXTENSION}>
          {translate(I18N_KEYS.BUTTON_LABEL)}
        </DisabledButtonWithTooltip>
      </div>
      {showSuccessFeedback ? (<div sx={{ gridColumn: '1/span 2' }}>
          <Alert showIcon size={AlertSize.SMALL} severity={AlertSeverity.SUCCESS} onClose={onCloseSuccessFeedback} closeIconName="Close">
            {translate(I18N_KEYS.SUCCESS_FEEDBACK)}
          </Alert>
        </div>) : null}
      {showErrorFeedback ? (<div sx={{ gridColumn: '1/span 2' }}>
          <Alert showIcon size={AlertSize.SMALL} severity={AlertSeverity.ERROR} onClose={onCloseErrorFeedback} closeIconName="Close">
            {translate(I18N_KEYS.ERROR_FEEDBACK)}
          </Alert>
        </div>) : null}
    </div>);
};
