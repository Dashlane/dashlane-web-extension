import { useState } from "react";
import { SendFeedbackDialog } from "./send/send-feedback-dialog";
import { FeedbackSuccessDialog } from "./success/feedback-success-dialog";
interface Props {
  onDismiss: () => void;
  onSend: () => void;
}
enum Steps {
  FeedbackPopup,
  ResultPopup,
  Done,
}
const FEEDBACK_POPUP_TIMEOUT = 10000;
export const Feedback = ({ onDismiss, onSend }: Props) => {
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
  return (
    <div>
      {step === Steps.FeedbackPopup && (
        <SendFeedbackDialog onDismiss={onDismiss} onFeedbackSent={handleSend} />
      )}

      {step === Steps.ResultPopup && (
        <FeedbackSuccessDialog onDismiss={handleFeedbackPopupClosed} />
      )}
    </div>
  );
};
