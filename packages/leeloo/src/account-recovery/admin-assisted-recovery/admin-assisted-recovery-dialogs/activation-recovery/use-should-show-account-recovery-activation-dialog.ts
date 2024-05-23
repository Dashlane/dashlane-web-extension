import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { NotificationName } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { useDiscontinuedStatus } from 'libs/carbon/hooks/useNodePremiumStatus';
import { useNotificationSeen } from 'libs/carbon/hooks/useNotificationStatus';
export function useShouldShowAccountRecoveryActivationDialog() {
    const shouldShowActivationPopUpResult = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getShouldShowFeatureActivationModal,
        },
    }, []);
    const { unseen, setAsSeen } = useNotificationSeen(NotificationName.AccountRecoveryAvailableEmployeeDialog);
    const discontinuedStatus = useDiscontinuedStatus();
    return {
        showDialog: unseen &&
            shouldShowActivationPopUpResult.status === DataStatus.Success &&
            shouldShowActivationPopUpResult.data &&
            !discontinuedStatus.isLoading &&
            discontinuedStatus.isTeamSoftDiscontinued !== undefined &&
            !discontinuedStatus.isTeamSoftDiscontinued,
        markDialogAsSeen: setAsSeen,
    };
}
