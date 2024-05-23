import { jsx } from '@dashlane/design-system';
import { accountRecoveryKeyApi, RecoveryFlowViewStep, } from '@dashlane/account-recovery-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
import { RecoveryErrorStep } from './recovery-error-step';
import { RecoverySuccessStep } from './recovery-success-step';
import { FlexContainer } from '@dashlane/ui-components';
import { BaseMarketingContainer } from 'auth/base-marketing-container/base-marketing-container';
export const AccountRecoveryKeyResult = () => {
    const recoveryFlowStatus = useModuleQuery(accountRecoveryKeyApi, 'recoveryFlowStatus');
    const getResultComponent = () => {
        switch (recoveryFlowStatus.data?.step) {
            case RecoveryFlowViewStep.Success:
                return <RecoverySuccessStep />;
            case RecoveryFlowViewStep.Failure:
                return <RecoveryErrorStep {...recoveryFlowStatus.data}/>;
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
        {getResultComponent()}
      </FlexContainer>
    </BaseMarketingContainer>);
};
