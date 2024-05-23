import { jsx } from '@dashlane/design-system';
import { RequestStatus } from '@dashlane/communication';
import { AccountRecoveryWithKeyDialog, AdminAssistedRecoveryDialog, ChooseAccountRecoveryMethodDialog, } from './account-recovery-dialogs';
import { AdminAssistedARStatus } from '../../types/admin-assisted-account-recovery';
interface Props {
    onClose: () => void;
    masterPassword: string;
    isAccountRecoveryKeyAvailable: boolean;
    isAdminAssistedRecoveryAvailable: boolean;
    existingAdminAssistedRecoveryStatus?: AdminAssistedARStatus;
}
export const AccountRecoveryContainer = ({ onClose, masterPassword, isAccountRecoveryKeyAvailable, isAdminAssistedRecoveryAvailable, existingAdminAssistedRecoveryStatus, }: Props) => {
    if (isAccountRecoveryKeyAvailable && !isAdminAssistedRecoveryAvailable) {
        return <AccountRecoveryWithKeyDialog onClose={onClose}/>;
    }
    else if ((!isAccountRecoveryKeyAvailable && isAdminAssistedRecoveryAvailable) ||
        (existingAdminAssistedRecoveryStatus?.processStatus === 'PENDING' &&
            existingAdminAssistedRecoveryStatus.requestStatus ===
                RequestStatus.APPROVED)) {
        return (<AdminAssistedRecoveryDialog onClose={onClose} masterPassword={masterPassword} existingARStatus={existingAdminAssistedRecoveryStatus}/>);
    }
    else if (isAccountRecoveryKeyAvailable &&
        isAdminAssistedRecoveryAvailable) {
        return <ChooseAccountRecoveryMethodDialog onClose={onClose}/>;
    }
    return null;
};
