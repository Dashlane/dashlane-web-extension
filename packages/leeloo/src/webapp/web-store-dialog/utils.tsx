import { differenceInMonths } from 'date-fns';
import { DataStatus, useFeatureFlips } from '@dashlane/framework-react';
import { UserMessage, UserMessageTypes } from '@dashlane/communication';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { addUserMessage, dismissUserMessage } from 'libs/user-messages';
import { usePersonalSettings } from 'libs/carbon/hooks/usePersonalSettings';
import { useUserMessage } from '../sharing-center/upgrade-dialog/useUserMessage';
const CHROME_STORE_V2_FF = FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebChromeratingV2;
const MS_AFTER_CREATION_USER_SHOULD_RATE_US = 40 * 24 * 60 * 60 * 1000;
export const useWebStoreMessage = () => {
    const { messages } = useUserMessage(UserMessageTypes.WEB_STORE);
    const personalSettings = usePersonalSettings();
    const retrievedFeatureFlips = useFeatureFlips();
    const isChromeStoreRatingV2FFEnabled = retrievedFeatureFlips.status === DataStatus.Success &&
        retrievedFeatureFlips.data[CHROME_STORE_V2_FF];
    const accountCreationUnixTime = personalSettings.status === DataStatus.Success
        ? personalSettings.data.accountCreationDatetime
        : 0;
    const shouldRateDashlane = Date.now() - accountCreationUnixTime >=
        MS_AFTER_CREATION_USER_SHOULD_RATE_US;
    const noWebStoreMessagesExists = messages.find((message: UserMessage) => {
        return message.type === UserMessageTypes.WEB_STORE;
    }) === undefined;
    const noWebStoreMessagesWithinThreshold = messages.find((message: UserMessage) => {
        const messageNewerThanThreshold = message.dismissedAt
            ? differenceInMonths(new Date(), message.dismissedAt) < 6
            : true;
        return (message.type === UserMessageTypes.WEB_STORE && messageNewerThanThreshold);
    }) === undefined;
    const shouldAddMessage = (noWebStoreMessagesExists || noWebStoreMessagesWithinThreshold) &&
        shouldRateDashlane;
    if (isChromeStoreRatingV2FFEnabled && shouldAddMessage) {
        return () => addUserMessage({ type: UserMessageTypes.WEB_STORE });
    }
    return null;
};
export const dismissWebStoreMessage = async () => {
    await dismissUserMessage({ type: UserMessageTypes.WEB_STORE });
};
