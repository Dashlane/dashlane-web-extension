import { useEffect } from "react";
import { Checkbox } from "@dashlane/design-system";
import { TOTAL_NUM_OF_PROFILING_QUESTIONS } from "../hooks/use-profile-admin-task";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ProfileAdminHeader } from "./profile-admin-header";
import { QuestionKey, QuestionProps, UseCasePossibleAnswers } from "../types";
import { logProfileNewAdminPageView } from "../logs";
const I18N_KEYS = {
  CLOSE: "_common_dialog_dismiss_button",
  CARD_TITLE: "onb_profile_admin_goal_question_subtitle",
  CARD_DESCRIPTION: "onb_profile_admin_goal_question_description",
  QUESTION_NUMBER: "onb_profile_admin_questions_number",
  ANSWER_1: "onb_profile_admin_goal_question_secure_passwords",
  ANSWER_2: "onb_profile_admin_goal_question_share_passwords",
  ANSWER_3: "onb_profile_admin_goal_question_store_data_one_place",
  ANSWER_4: "onb_profile_admin_goal_question_control_data_access",
  ANSWER_5: "onb_profile_admin_goal_question_none_above",
};
export const UseCaseQuestion = ({
  answers,
  questionNumber,
  setAnswers,
}: QuestionProps) => {
  const { translate } = useTranslate();
  useEffect(() => {
    logProfileNewAdminPageView(QuestionKey.USECASE);
  }, []);
  const handleChangeCheckbox = (key: UseCasePossibleAnswers) => {
    if (answers.includes(key)) {
      setAnswers(answers.filter((answerKey) => answerKey !== key));
    } else {
      setAnswers([...answers, key]);
    }
  };
  const isNoneOption = answers.includes(UseCasePossibleAnswers.None);
  const isNotNoneOption =
    !answers.includes(UseCasePossibleAnswers.None) && answers.length !== 0;
  const optionList = [
    {
      label: I18N_KEYS.ANSWER_1,
      onChange: () =>
        handleChangeCheckbox(UseCasePossibleAnswers.SecurePasswords),
      optionKey: UseCasePossibleAnswers.SecurePasswords,
      disabled: isNoneOption,
    },
    {
      label: I18N_KEYS.ANSWER_2,
      onChange: () =>
        handleChangeCheckbox(UseCasePossibleAnswers.SharePasswords),
      optionKey: UseCasePossibleAnswers.SharePasswords,
      disabled: isNoneOption,
    },
    {
      label: I18N_KEYS.ANSWER_3,
      onChange: () =>
        handleChangeCheckbox(UseCasePossibleAnswers.StoreDataOnePlace),
      optionKey: UseCasePossibleAnswers.StoreDataOnePlace,
      disabled: isNoneOption,
    },
    {
      label: I18N_KEYS.ANSWER_4,
      onChange: () =>
        handleChangeCheckbox(UseCasePossibleAnswers.ControlDataAccess),
      optionKey: UseCasePossibleAnswers.ControlDataAccess,
      disabled: isNoneOption,
    },
    {
      label: I18N_KEYS.ANSWER_5,
      onChange: () => handleChangeCheckbox(UseCasePossibleAnswers.None),
      optionKey: UseCasePossibleAnswers.None,
      disabled: isNotNoneOption,
    },
  ];
  return (
    <>
      <ProfileAdminHeader
        questionNumber={translate(I18N_KEYS.QUESTION_NUMBER, {
          questionIndex: questionNumber,
          totalQuestions: TOTAL_NUM_OF_PROFILING_QUESTIONS,
        })}
        headerTitle={translate(I18N_KEYS.CARD_TITLE)}
        headerDescription={translate(I18N_KEYS.CARD_DESCRIPTION)}
      />

      {optionList.map(({ label, disabled, onChange, optionKey }) => (
        <Checkbox
          key={label}
          label={translate(label)}
          disabled={disabled}
          checked={answers.includes(optionKey)}
          onChange={onChange}
          value={optionKey}
        />
      ))}
    </>
  );
};
