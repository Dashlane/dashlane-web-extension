import { useEffect } from "react";
import { Checkbox } from "@dashlane/design-system";
import { TOTAL_NUM_OF_PROFILING_QUESTIONS } from "../hooks/use-profile-admin-task";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ProfileAdminHeader } from "./profile-admin-header";
import { FeaturesPossibleAnswers, QuestionKey, QuestionProps } from "../types";
import { logProfileNewAdminPageView } from "../logs";
const I18N_KEYS = {
  CLOSE: "_common_dialog_dismiss_button",
  CARD_TITLE: "onb_profile_admin_setup_preference_question_subtitle",
  CARD_DESCRIPTION: "onb_profile_admin_setup_preference_question_description",
  QUESTION_NUMBER: "onb_profile_admin_questions_number",
  ANSWER_1: "onb_profile_admin_setup_preference_question_scim",
  ANSWER_1_DESCRIPTION:
    "onb_profile_admin_setup_preference_question_scim_description",
  ANSWER_2: "onb_profile_admin_setup_preference_question_sso",
  ANSWER_2_DESCRIPTION:
    "onb_profile_admin_setup_preference_question_sso_description",
  ANSWER_3: "onb_profile_admin_setup_preference_question_jit",
  ANSWER_3_DESCRIPTION:
    "onb_profile_admin_setup_preference_question_jit_description",
  ANSWER_4: "onb_profile_admin_setup_preference_question_mass",
  ANSWER_4_DESCRIPTION:
    "onb_profile_admin_setup_preference_question_mass_description",
  ANSWER_5: "onb_profile_admin_setup_preference_question_siem",
  ANSWER_5_DESCRIPTION:
    "onb_profile_admin_setup_preference_question_siem_description",
  ANSWER_6: "onb_profile_admin_setup_preference_question_generic",
};
export const FeatureQuestion = ({
  answers,
  questionNumber,
  setAnswers,
}: QuestionProps) => {
  const { translate } = useTranslate();
  useEffect(() => {
    logProfileNewAdminPageView(QuestionKey.FEATURES);
  }, []);
  const handleChangeCheckbox = (key: FeaturesPossibleAnswers) => {
    if (answers.includes(key)) {
      setAnswers(answers.filter((answerKey) => answerKey !== key));
    } else {
      setAnswers([...answers, key]);
    }
  };
  const optionList = [
    {
      label: I18N_KEYS.ANSWER_1,
      description: I18N_KEYS.ANSWER_1_DESCRIPTION,
      onChange: () => handleChangeCheckbox(FeaturesPossibleAnswers.Scim),
      optionKey: FeaturesPossibleAnswers.Scim,
    },
    {
      label: I18N_KEYS.ANSWER_2,
      description: I18N_KEYS.ANSWER_2_DESCRIPTION,
      onChange: () => handleChangeCheckbox(FeaturesPossibleAnswers.Sso),
      optionKey: FeaturesPossibleAnswers.Sso,
    },
    {
      label: I18N_KEYS.ANSWER_3,
      description: I18N_KEYS.ANSWER_3_DESCRIPTION,
      onChange: () => handleChangeCheckbox(FeaturesPossibleAnswers.Jit),
      optionKey: FeaturesPossibleAnswers.Jit,
    },
    {
      label: I18N_KEYS.ANSWER_4,
      description: I18N_KEYS.ANSWER_4_DESCRIPTION,
      onChange: () =>
        handleChangeCheckbox(FeaturesPossibleAnswers.MassDeployment),
      optionKey: FeaturesPossibleAnswers.MassDeployment,
    },
    {
      label: I18N_KEYS.ANSWER_5,
      description: I18N_KEYS.ANSWER_5_DESCRIPTION,
      onChange: () => handleChangeCheckbox(FeaturesPossibleAnswers.Siem),
      optionKey: FeaturesPossibleAnswers.Siem,
    },
    {
      label: I18N_KEYS.ANSWER_6,
      onChange: () => handleChangeCheckbox(FeaturesPossibleAnswers.NotSure),
      optionKey: FeaturesPossibleAnswers.NotSure,
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

      {optionList.map(({ label, description, onChange, optionKey }) => (
        <Checkbox
          key={label}
          label={translate(label)}
          checked={answers.includes(optionKey)}
          description={description ? translate(description) : undefined}
          onChange={onChange}
          value={optionKey}
        />
      ))}
    </>
  );
};
