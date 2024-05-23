import { useState } from 'react';
import { Lee } from 'lee';
import Send from './send';
import Result from './result';
import { jsx } from '@dashlane/ui-components';
interface Props {
    lee: Lee;
    onDismiss: () => void;
    onSend: () => void;
}
enum Steps {
    FeedbackPopup,
    ResultPopup,
    Done
}
const FEEDBACK_POPUP_TIMEOUT = 10000;
export const Feedback = ({ lee, onDismiss, onSend }: Props) => {
    const [step, setStep] = useState<Steps>(Steps.FeedbackPopup);
    let _resultPopupTimeout: number;
    const handleFeedbackPopupClosed = (): void => {
        clearTimeout(_resultPopupTimeout);
        setStep(Steps.Done);
        onSend();
    };
    const handleSend = (): void => {
        setStep(Steps.ResultPopup);
        _resultPopupTimeout = window.setTimeout(() => {
            handleFeedbackPopupClosed();
        }, FEEDBACK_POPUP_TIMEOUT);
    };
    return (<div>
      {step === Steps.FeedbackPopup && (<Send lee={lee} onDismiss={onDismiss} onFeedbackSent={handleSend}/>)}

      {step === Steps.ResultPopup && (<Result onDismiss={handleFeedbackPopupClosed}/>)}
    </div>);
};
