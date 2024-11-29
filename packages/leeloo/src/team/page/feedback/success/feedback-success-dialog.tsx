import { Dialog, Icon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  DIALOG_TITLE: "team_feedback_result_dialog_title",
  BODY_TITLE: "team_feedback_result_body_title",
  BODY_TEXT: "team_feedback_result_body_text",
  CLOSE_DIALOG: "_common_dialog_dismiss_button",
};
interface Props {
  onDismiss: () => void;
}
export const FeedbackSuccessDialog = ({ onDismiss }: Props): JSX.Element => {
  const { translate } = useTranslate();
  return (
    <Dialog
      isOpen
      onClose={onDismiss}
      closeActionLabel={translate(I18N_KEYS.CLOSE_DIALOG)}
      title={translate(I18N_KEYS.DIALOG_TITLE)}
    >
      <div sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Icon
          name="FeedbackSuccessOutlined"
          size="xlarge"
          color="ds.text.positive.standard"
        />
        <div>
          <Paragraph textStyle="ds.body.standard.regular">{`${translate(
            I18N_KEYS.BODY_TITLE
          )}. ${translate(I18N_KEYS.BODY_TEXT)}`}</Paragraph>
        </div>
      </div>
    </Dialog>
  );
};
