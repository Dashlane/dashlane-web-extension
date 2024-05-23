import { Redirect } from 'react-router-dom';
import { accountRecoveryKeyApi, RecoveryFlowViewStep, } from '@dashlane/account-recovery-contracts';
import { jsx } from '@dashlane/design-system';
import { useModuleCommands, useModuleQuery } from '@dashlane/framework-react';
import { FlexContainer } from '@dashlane/ui-components';
import { ACCOUNT_RECOVERY_KEY_RESULT_SEGMENT } from 'app/routes/constants';
import { BaseMarketingContainer } from 'auth/base-marketing-container/base-marketing-container';
import { ConfirmAccountRecoveryKeyStep } from './steps/confirm-account-recovery-key-step';
import { ChangeMasterPasswordStep } from './steps/change-master-password-step';
import { FinalisingStep } from './steps/finalising-step';
import { VerifyYourIdentityStep } from './steps/verify-your-identity-step';
export const AccountRecoveryKeyContainer = () => {
    const { cancelRecoveryFlow, submitRecoveryKey, confirmNewPassword } = useModuleCommands(accountRecoveryKeyApi);
    const recoveryFlowStatus = useModuleQuery(accountRecoveryKeyApi, 'recoveryFlowStatus');
    const getCurrentStep = () => {
        switch (recoveryFlowStatus.data?.step) {
            case RecoveryFlowViewStep.IdentityVerification:
                return <VerifyYourIdentityStep login={recoveryFlowStatus.data.login}/>;
            case RecoveryFlowViewStep.EnterRecoveryKey:
                return (<ConfirmAccountRecoveryKeyStep {...recoveryFlowStatus.data} onSubmit={submitRecoveryKey} onCancel={cancelRecoveryFlow}/>);
            case RecoveryFlowViewStep.ChangeMasterPassword:
                return (<ChangeMasterPasswordStep onSubmit={confirmNewPassword} onCancel={cancelRecoveryFlow}/>);
            case RecoveryFlowViewStep.Finalising:
                return <FinalisingStep />;
            case RecoveryFlowViewStep.Success:
            case RecoveryFlowViewStep.Failure:
                return <Redirect to={ACCOUNT_RECOVERY_KEY_RESULT_SEGMENT}/>;
            default:
                return null;
        }
    };
    return (<BaseMarketingContainer backgroundColor="ds.background.default">
      <FlexContainer sx={{
            flexDirection: 'column',
            margin: '0px auto 0px auto',
            alignItems: 'flex-start',
            justifyContent: 'center',
            height: 'calc(100vh - 50px)',
            width: '550px',
        }}>
        {getCurrentStep()}
      </FlexContainer>
    </BaseMarketingContainer>);
};
