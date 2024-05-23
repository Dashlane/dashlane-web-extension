import { jsx } from '@dashlane/design-system';
import { useShareItemNotification } from 'team/get-started/hooks/notifications';
import { useIsTeamCreator } from 'team/get-started/hooks/use-is-team-creator';
import { DataStatus } from '@dashlane/framework-react';
const TriggerShareItemNotification = () => {
    useShareItemNotification();
    return null;
};
export const TacShareItemNotification = () => {
    const isTeamCreator = useIsTeamCreator();
    return isTeamCreator.status === DataStatus.Success &&
        isTeamCreator.isTeamCreator ? (<TriggerShareItemNotification />) : null;
};
