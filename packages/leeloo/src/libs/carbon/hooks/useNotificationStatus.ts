import * as React from 'react';
import { NotificationName, NotificationStatus } from '@dashlane/communication';
import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export const useNotificationSeen = (name: NotificationName): {
    unseen: boolean;
    setAsSeen: () => Promise<void>;
} => {
    const { current: setAsSeen } = React.useRef(() => carbonConnector.markNotificationAsSeen(name));
    const statusData = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getNotificationStatus,
        },
        liveConfig: {
            live: carbonConnector.liveNotificationStatus,
        },
    }, []);
    const unseen = statusData.status === DataStatus.Success &&
        statusData.data[name] === NotificationStatus.Unseen;
    return { unseen, setAsSeen };
};
export const useNotificationInteracted = (name: NotificationName): {
    interacted: boolean;
    setAsInteracted: () => Promise<void>;
    status: DataStatus;
} => {
    const { current: setAsInteracted } = React.useRef(() => carbonConnector.markNotificationAsInteracted(name));
    const statusData = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getNotificationStatus,
        },
        liveConfig: {
            live: carbonConnector.liveNotificationStatus,
        },
    }, []);
    const interacted = statusData.status === DataStatus.Loading ||
        (statusData.status === DataStatus.Success &&
            statusData.data[name] === NotificationStatus.Interacted);
    return { interacted, setAsInteracted, status: statusData.status };
};
