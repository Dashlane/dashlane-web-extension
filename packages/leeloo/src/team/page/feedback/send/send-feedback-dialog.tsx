import { useEffect, useRef, useState } from "react";
import { Dialog, Paragraph, TextInput } from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import { isSuccess } from "@dashlane/framework-types";
import { teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useAlertQueue } from "../../../alerts/use-alert-queue";
import {
  logFeedbackModalClosed,
  logFeedbackSent,
  sendFeedbackPageView,
} from "./logs";
const I18N_KEYS = {
  DIALOG_BUTTON_OK: "team_feedback_dialog_button_ok",
  DIALOG_ERROR_MARKUP: "team_feedback_dialog_error_markup",
  CLOSE_DIALOG: "_common_dialog_dismiss_button",
};
const I18N_KEYS_UPD = {
  DIALOG_UPD_TITLE: "team_feedback_dialog_upd_title",
  DIALOG_UPD_TEXT_MARKUP: "team_feedback_dialog_upd_text_markup",
  DIALOG_UPD_TEXTAREA_LABEL: "team_feedback_dialog_upd_textarea_label",
};
interface Props {
  onDismiss: () => void;
  onFeedbackSent: (error?: Error) => void;
}
export const SendFeedbackDialog = ({ onDismiss, onFeedbackSent }: Props) => {
  const [isCtaDisabled, setIsCtaDisabled] = useState<boolean>(true);
  const [isCtaLoading, setIsCtaLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const { translate } = useTranslate();
  const { reportTACError } = useAlertQueue();
  const feedbackRef = useRef<HTMLInputElement>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const { sendFeedback } = useModuleCommands(teamPlanDetailsApi);
  useEffect(() => {
    sendFeedbackPageView();
  }, []);
  const onClose = () => {
    logFeedbackModalClosed();
    onDismiss();
  };
  const handleFeedbackFieldValueChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFeedbackText(feedbackRef?.current?.value ?? "");
    const ctaIsDisabled = !evt.target.value;
    setIsCtaDisabled(ctaIsDisabled);
  };
  const _sendFeedback = async (): Promise<void> => {
    setIsCtaLoading(true);
    setShowError(false);
    const result = await sendFeedback({ feedbackBody: feedbackText });
    if (isSuccess(result)) {
      logFeedbackSent();
      onFeedbackSent();
    } else {
      reportTACError(new Error(result.error.message));
      setIsCtaLoading(false);
      setShowError(true);
    }
  };
  return (
    <Dialog
      isOpen
      onClose={onClose}
      actions={{
        primary: {
          children: translate(I18N_KEYS.DIALOG_BUTTON_OK),
          onClick: () => _sendFeedback(),
          disabled: isCtaDisabled || isCtaLoading,
        },
      }}
      title={translate(I18N_KEYS_UPD.DIALOG_UPD_TITLE)}
      closeActionLabel={translate(I18N_KEYS.CLOSE_DIALOG)}
    >
      <Paragraph
        textStyle="ds.body.reduced.regular"
        color="ds.text.neutral.quiet"
      >
        {translate.markup(
          I18N_KEYS_UPD.DIALOG_UPD_TEXT_MARKUP,
          {},
          { linkTarget: "_blank" }
        )}
      </Paragraph>

      <TextInput
        sx={{ resize: "vertical", maxHeight: "300px" }}
        value={feedbackText}
        ref={feedbackRef}
        placeholder={translate(I18N_KEYS_UPD.DIALOG_UPD_TEXTAREA_LABEL)}
        onChange={handleFeedbackFieldValueChange}
      />

      {showError ? (
        <Paragraph
          color="ds.text.danger.quiet"
          textStyle="ds.body.standard.strong"
        >
          {translate.markup(I18N_KEYS.DIALOG_ERROR_MARKUP)}
        </Paragraph>
      ) : null}
    </Dialog>
  );
};
