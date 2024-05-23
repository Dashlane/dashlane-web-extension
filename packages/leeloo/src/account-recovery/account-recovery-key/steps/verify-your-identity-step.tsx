import { accountRecoveryKeyApi, RecoveryFlowViewStep, } from '@dashlane/account-recovery-contracts';
import { IdentityVerificationFlowContracts } from '@dashlane/authentication-contracts';
import { Heading, jsx, Paragraph } from '@dashlane/design-system';
import { useModuleCommands, useModuleQuery } from '@dashlane/framework-react';
import useTranslate from 'libs/i18n/useTranslate';
import { AccountBackupCode, AccountEmailToken, AccountTotp, DashlaneAuthenticator, } from './identity-verification-steps';
const I18N_KEYS = {
    VERIFY_YOUR_IDENTITY_STEP_TITLE: 'login_verify_your_identity_step_title',
};
export const VerifyYourIdentityStep = (props: {
    login: string;
}) => {
    const { translate } = useTranslate();
    const recoveryFlowStatus = useModuleQuery(accountRecoveryKeyApi, 'recoveryFlowStatus');
    const { cancelRecoveryFlow } = useModuleCommands(accountRecoveryKeyApi);
    const identityVerificationFlowStatus = useModuleQuery(IdentityVerificationFlowContracts.identityVerificationFlowApi, 'identityVerificationFlowStatus');
    const { submitEmailToken, resendEmailToken, switchToDashlaneAuthenticator, changeTwoFactorAuthenticationOtpType, clearError, resendPushNotification, submitTotp, submitBackupCode, switchToEmailToken, } = useModuleCommands(IdentityVerificationFlowContracts.identityVerificationFlowApi);
    const clearInputError = () => {
        if (identityVerificationFlowStatus.data?.error) {
            clearError();
        }
    };
    const getCurrentStep = () => {
        if (recoveryFlowStatus.data?.step !==
            RecoveryFlowViewStep.IdentityVerification) {
            return;
        }
        switch (identityVerificationFlowStatus.data?.step) {
            case 'EmailTokenStep':
                return (<AccountEmailToken clearInputError={clearInputError} resendEmailToken={resendEmailToken} submitEmailToken={submitEmailToken} switchToDashlaneAuthenticator={switchToDashlaneAuthenticator} cancelAccountRecoveryKey={cancelRecoveryFlow} {...identityVerificationFlowStatus.data}/>);
            case 'DashlaneAuthenticatorStep':
                return (<DashlaneAuthenticator cancelAccountRecoveryKey={cancelRecoveryFlow} resendPushNotification={resendPushNotification} switchToEmailToken={switchToEmailToken} {...identityVerificationFlowStatus.data}/>);
            case 'TwoFactorAuthenticationOtpStep':
                if (identityVerificationFlowStatus.data.twoFactorAuthenticationOtpType !==
                    undefined &&
                    identityVerificationFlowStatus.data.twoFactorAuthenticationOtpType ===
                        'backupCode') {
                    return (<AccountBackupCode submitBackupCode={submitBackupCode} changeTwoFactorAuthenticationOtpType={changeTwoFactorAuthenticationOtpType} cancelAccountRecoveryKey={cancelRecoveryFlow} {...identityVerificationFlowStatus.data} login={props.login}/>);
                }
                return (<AccountTotp submitTotp={submitTotp} changeTwoFactorAuthenticationOtpType={changeTwoFactorAuthenticationOtpType} cancelAccountRecoveryKey={cancelRecoveryFlow} clearInputError={clearInputError} {...identityVerificationFlowStatus.data} login={props.login}/>);
            default:
                return null;
        }
    };
    return (<div>
      <Heading as="h1" textStyle="ds.title.section.large" color="ds.text.neutral.catchy" sx={{ marginBottom: '32px' }}>
        {translate(I18N_KEYS.VERIFY_YOUR_IDENTITY_STEP_TITLE)}
      </Heading>
      {recoveryFlowStatus.data?.step ===
            RecoveryFlowViewStep.IdentityVerification ? (<Paragraph textStyle="ds.body.standard.strong" sx={{ marginBottom: '16px' }}>
          {recoveryFlowStatus.data.login}{' '}
        </Paragraph>) : null}
      {getCurrentStep()}
    </div>);
};
