import { logEvent } from 'libs/logs/logEvent';
import { UserResendTokenEvent } from '@dashlane/hermes';
export const logResendTokenEvent = () => {
    logEvent(new UserResendTokenEvent({}));
};
