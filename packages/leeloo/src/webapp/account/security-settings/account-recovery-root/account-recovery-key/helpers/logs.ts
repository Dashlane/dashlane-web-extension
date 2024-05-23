import { DeleteKeyReason, FlowStep, UserCreateAccountRecoveryKeyEvent, UserDeleteAccountRecoveryKeyEvent, } from '@dashlane/hermes';
import { logEvent } from 'libs/logs/logEvent';
export const logUserDeleteAccountRecoveryKey = (deleteKeyReason: DeleteKeyReason) => {
    void logEvent(new UserDeleteAccountRecoveryKeyEvent({
        deleteKeyReason,
    }));
};
export const logUserCreateAccountRecoveryKeyEventCancel = () => {
    void logEvent(new UserCreateAccountRecoveryKeyEvent({ flowStep: FlowStep.Cancel }));
};
export const logUserCreateAccountRecoveryKeyEventComplete = () => {
    void logEvent(new UserCreateAccountRecoveryKeyEvent({ flowStep: FlowStep.Complete }));
};
