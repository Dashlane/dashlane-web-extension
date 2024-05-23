import { Store } from 'store/create';
import { getCurrentSpace } from 'libs/carbon/spaces';
import { getMasterPasswordResetDemandList } from 'libs/carbon/triggers';
import { websiteLogAction } from 'libs/logs';
export default function teamAdminNotifications(store: Store): void {
    const space = getCurrentSpace(store.getState());
    if (!space || !space.teamId) {
        return;
    }
    if (!space.details.info.recoveryEnabled || !space.details.isTeamAdmin) {
        return;
    }
    getMasterPasswordResetDemandList({ teamId: Number(space.teamId) }).catch((error) => {
        websiteLogAction.error({
            message: 'getMasterPasswordResetDemandList failed',
            content: {
                error: error.message,
                version: VERSION,
            },
        });
    });
}
