import { useEffect, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { DataStatus, useFeatureFlip, useModuleQuery, } from '@dashlane/framework-react';
import { teamAdminNotificationsApi } from '@dashlane/team-admin-contracts';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { AdminAccess } from 'user/permissions';
import { TrialDiscontinuedDialog } from 'libs/trial/trial-dialogs/trial-discontinued-dialog';
import { getUrlSearchParams } from 'libs/router';
import { useWebappLogoutDialogContext } from 'webapp/webapp-logout-dialog-context';
import { useTrialDiscontinuedDialogContext } from '../trialDiscontinuationDialogContext';
export const SEARCH_PARAM = 'trialDiscontinued';
interface AdminAccessProp {
    adminAccess: AdminAccess;
    openOnDemand: boolean;
}
export const TrialDiscontinuedDialogFlow = ({ adminAccess, openOnDemand = false, }: AdminAccessProp) => {
    const [canShowTrialDiscontinuedDialog, setCanShowTrialDiscontinuedDialog] = useState(false);
    const { closeDialog: closeOnDemandDialog } = useTrialDiscontinuedDialogContext();
    const { isLogoutDialogOpen } = useWebappLogoutDialogContext();
    const hasSeenB2BPlanDiscontinuedQuery = useModuleQuery(teamAdminNotificationsApi, 'hasSeenB2BPlanDiscontinued');
    const hasB2BDiscontinuationFFEnabled = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebB2BDiscontinuationPhase1);
    const searchParams = getUrlSearchParams();
    const searchParamValue = searchParams.get(SEARCH_PARAM);
    const openFromUrl = !!searchParamValue && searchParamValue === 'true';
    const hasSeenB2BPlanDiscontinued = hasSeenB2BPlanDiscontinuedQuery.status === DataStatus.Success
        ? hasSeenB2BPlanDiscontinuedQuery.data
        : null;
    const handleCloseDialog = () => {
        closeOnDemandDialog();
        setCanShowTrialDiscontinuedDialog(false);
    };
    const { hasBillingAccess, hasFullAccess } = adminAccess;
    useEffect(() => {
        if (typeof hasSeenB2BPlanDiscontinued === 'boolean' &&
            (!hasSeenB2BPlanDiscontinued || openOnDemand || openFromUrl) &&
            (hasBillingAccess || hasFullAccess) &&
            !isLogoutDialogOpen) {
            setCanShowTrialDiscontinuedDialog(true);
        }
    }, [
        hasBillingAccess,
        hasFullAccess,
        hasSeenB2BPlanDiscontinued,
        isLogoutDialogOpen,
        openFromUrl,
        openOnDemand,
    ]);
    if (typeof hasSeenB2BPlanDiscontinued !== 'boolean' ||
        !hasB2BDiscontinuationFFEnabled ||
        !canShowTrialDiscontinuedDialog) {
        return null;
    }
    return <TrialDiscontinuedDialog onClose={handleCloseDialog}/>;
};
