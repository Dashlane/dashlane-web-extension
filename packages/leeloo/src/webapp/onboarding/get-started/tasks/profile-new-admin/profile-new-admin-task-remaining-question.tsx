import { Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
interface ProfileNewAdminTaskRemainingQuestionsProps {
  remainingQuestion: number;
}
export const I18N_KEYS = {
  REMAINING_QUESTION:
    "onb_vault_get_started_task_profile_new_admin_remaining_question",
};
export const ProfileNewAdminRemainingQuestions = ({
  remainingQuestion,
}: ProfileNewAdminTaskRemainingQuestionsProps) => {
  const { translate } = useTranslate();
  return (
    <Paragraph textStyle="ds.body.helper.regular" color="ds.text.warning.quiet">
      {translate(I18N_KEYS.REMAINING_QUESTION, {
        count: remainingQuestion,
      })}
    </Paragraph>
  );
};
