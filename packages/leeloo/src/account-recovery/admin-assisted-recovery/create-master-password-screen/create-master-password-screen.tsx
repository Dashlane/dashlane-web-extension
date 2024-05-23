import React from 'react';
import { Lee } from 'lee';
import { carbonConnector } from 'libs/carbon/connector';
import { CreateMasterPasswordPanel } from 'create-master-password-panel/create-master-password-panel';
import { GenericRecoveryErrorDialog } from 'account-recovery/admin-assisted-recovery/admin-assisted-recovery-dialogs/generic-recovery-error/generic-recovery-error';
import { useHistory } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { AccountRecoveryMarketingContainer } from 'auth/marketing-container/account-recovery/account-recovery';
import { AccountRecoveryStep } from 'account-recovery/admin-assisted-recovery/types';
import styles from '../account-recovery.css';
interface Props {
    lee: Lee;
}
export const CreateMasterPasswordScreen = ({ lee }: Props) => {
    const history = useHistory();
    const { routes } = useRouterGlobalSettingsContext();
    const [showGenericRecoveryError, setShowGenericRecoveryError] = React.useState(false);
    const [showCreateMasterPasswordError, setShowCreateMasterPasswordError] = React.useState('');
    const createNewMasterPassword = async (masterPassword: string): Promise<void> => {
        try {
            const response = await carbonConnector.setupMasterPasswordForRecovery({
                masterPassword,
            });
            if (!response.success) {
                setShowCreateMasterPasswordError(response.error.code);
                return;
            }
            history.push(routes.userSendRequest);
        }
        catch (err) {
            setShowGenericRecoveryError(true);
        }
    };
    return (<div className={styles.panelsContainer}>
      <AccountRecoveryMarketingContainer step={AccountRecoveryStep.CREATE_MASTER_PASSWORD}/>
      <CreateMasterPasswordPanel dispatchGlobal={lee.dispatchGlobal} onSubmit={createNewMasterPassword} createMPForAccountRecovery={true} showCreateMasterPasswordError={showCreateMasterPasswordError}/>
      <GenericRecoveryErrorDialog isAccountRecoveryError={showGenericRecoveryError} handleGenericRecoveryErrorClose={() => {
            setShowGenericRecoveryError(false);
        }}/>
    </div>);
};
