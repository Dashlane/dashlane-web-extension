import React from 'react';
import { useModuleQuery } from '@dashlane/framework-react';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { SessionState } from '@dashlane/session-contracts';
import { CustomRoute, RoutesProps, WrappingRoute } from 'libs/router';
import { useSessionState } from 'libs/carbon/hooks/useSessionState';
import AdminAssistedRecoveryRoutes from './admin-assisted-recovery/routes';
import { AccountRecoveryKeyContainer } from './account-recovery-key/account-recovery-key-container';
export default function routes({ path }: RoutesProps): JSX.Element {
    const authenticationFlowStatus = useModuleQuery(AuthenticationFlowContracts.authenticationFlowApi, 'authenticationFlowStatus');
    const sessionState = useSessionState();
    const getAccountRecoveryKeyComponent = () => {
        return authenticationFlowStatus.data?.step === 'MasterPasswordStep' ||
            authenticationFlowStatus.data?.step ===
                'DeviceToDeviceAuthenticationStep' ||
            sessionState === SessionState.Open
            ? AccountRecoveryKeyContainer
            : undefined;
    };
    return (<WrappingRoute path={[`${path}/admin-assisted-recovery`, `${path}/account-recovery-key`]}>
      <AdminAssistedRecoveryRoutes path={`${path}/admin-assisted-recovery`}/>
      <CustomRoute exact path={`${path}/account-recovery-key`} component={getAccountRecoveryKeyComponent()}/>
    </WrappingRoute>);
}
