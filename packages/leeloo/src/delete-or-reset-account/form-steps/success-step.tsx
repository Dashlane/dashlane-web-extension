import { Heading, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
export const I18N_KEYS = {
  SUCCESS_STEP_DELETE_TITLE: "webapp_success_step_title_account_deletion",
  SUCCESS_STEP_DELETE_MESSAGE:
    "webapp_success_step_message_account_deletion_markup",
  SUCCESS_STEP_RESET_TITLE: "webapp_success_step_title_account_reset",
  SUCCESS_STEP_RESET_MESSAGE:
    "webapp_success_step_message_account_reset_markup",
};
interface SuccessStepProps {
  isDelete: boolean;
}
export const SuccessStep = ({ isDelete }: SuccessStepProps) => {
  const { translate } = useTranslate();
  return (
    <>
      <Heading as="h2">
        {translate(
          isDelete
            ? I18N_KEYS.SUCCESS_STEP_DELETE_TITLE
            : I18N_KEYS.SUCCESS_STEP_RESET_TITLE
        )}
      </Heading>
      <Paragraph>
        {isDelete
          ? translate.markup(
              I18N_KEYS.SUCCESS_STEP_DELETE_MESSAGE,
              {},
              { linkTarget: "_blank" }
            )
          : translate.markup(I18N_KEYS.SUCCESS_STEP_RESET_MESSAGE)}
      </Paragraph>
    </>
  );
};
