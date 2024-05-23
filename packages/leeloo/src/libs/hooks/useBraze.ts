import { useEffect } from 'react';
import * as braze from '@braze/web-sdk';
import { usePublicUserId } from 'libs/carbon/hooks/usePublicUserId';
import { DataStatus } from '@dashlane/carbon-api-consumers';
export const useBraze = () => {
    const publicUserIdQuery = usePublicUserId();
    const publicUserId = publicUserIdQuery.status === DataStatus.Success
        ? publicUserIdQuery.data
        : null;
    useEffect(() => {
        if (publicUserId) {
            const brazeApiKey = '*****';
            const baseUrl = 'sdk.iad-01.braze.com';
            braze.initialize(brazeApiKey, {
                baseUrl,
                allowUserSuppliedJavascript: true,
            });
            braze.automaticallyShowInAppMessages();
            braze.subscribeToInAppMessage(function (inAppMessage) {
                braze.showInAppMessage(inAppMessage);
            });
            braze.changeUser(publicUserId);
            braze.openSession();
        }
    }, [publicUserId]);
};
