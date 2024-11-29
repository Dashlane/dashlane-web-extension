import { ChangeEvent, useEffect } from "react";
import { Radio, RadioGroup } from "@dashlane/design-system";
import { TOTAL_NUM_OF_PROFILING_QUESTIONS } from "../hooks/use-profile-admin-task";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ProfileAdminHeader } from "./profile-admin-header";
import {
  FamiliarityPossibleAnswers,
  QuestionKey,
  QuestionProps,
} from "../types";
import { logProfileNewAdminPageView } from "../logs";
const I18N_KEYS = {
  CLOSE: "_common_dialog_dismiss_button",
  CARD_TITLE: "onb_profile_admin_familiarity_question_subtitle",
  CARD_DESCRIPTION: "onb_profile_admin_familiarity_question_description",
  QUESTION_NUMBER: "onb_profile_admin_questions_number",
  ANSWER_1: "onb_profile_admin_familiarity_question_super",
  ANSWER_1_DESCRIPTION:
    "onb_profile_admin_familiarity_question_super_description",
  ANSWER_2: "onb_profile_admin_familiarity_question_very",
  ANSWER_2_DESCRIPTION:
    "onb_profile_admin_familiarity_question_very_description",
  ANSWER_3: "onb_profile_admin_familiarity_question_somewhat",
  ANSWER_3_DESCRIPTION:
    "onb_profile_admin_familiarity_question_somewhat_description",
  ANSWER_4: "onb_profile_admin_familiarity_question_not_very",
  ANSWER_4_DESCRIPTION:
    "onb_profile_admin_familiarity_question_not_very_description",
  ANSWER_5: "onb_profile_admin_familiarity_question_not_at_all",
  ANSWER_5_DESCRIPTION:
    "onb_profile_admin_familiarity_question_not_at_all_description",
};
export const FamiliarityQuestion = ({
  answers,
  questionNumber,
  setAnswers,
}: QuestionProps) => {
  const { translate } = useTranslate();
  useEffect(() => {
    logProfileNewAdminPageView(QuestionKey.FAMILIARITY);
  }, []);
  const handleChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswers([e.target.value]);
  };
  const optionsList = [
    {
      label: I18N_KEYS.ANSWER_1,
      description: I18N_KEYS.ANSWER_1_DESCRIPTION,
      optionKey: FamiliarityPossibleAnswers.SuperFamiliar,
    },
    {
      label: I18N_KEYS.ANSWER_2,
      description: I18N_KEYS.ANSWER_2_DESCRIPTION,
      optionKey: FamiliarityPossibleAnswers.VeryFamiliar,
    },
    {
      label: I18N_KEYS.ANSWER_3,
      description: I18N_KEYS.ANSWER_3_DESCRIPTION,
      optionKey: FamiliarityPossibleAnswers.SomewhatVeryFamiliar,
    },
    {
      label: I18N_KEYS.ANSWER_4,
      description: I18N_KEYS.ANSWER_4_DESCRIPTION,
      optionKey: FamiliarityPossibleAnswers.NotVeryFamiliar,
    },
    {
      label: I18N_KEYS.ANSWER_5,
      description: I18N_KEYS.ANSWER_5_DESCRIPTION,
      optionKey: FamiliarityPossibleAnswers.NotFamiliarAtAll,
    },
  ];
  const selectedAnswer = answers[0];
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

      <RadioGroup
        groupName="Familiarity Question Answers"
        value={selectedAnswer}
        onChange={handleChangeCheckbox}
      >
        {optionsList.map(({ label, description, optionKey }) => (
          <Radio
            key={label}
            label={translate(label)}
            value={optionKey}
            description={translate(description)}
          />
        ))}
      </RadioGroup>
    </>
  );
};
