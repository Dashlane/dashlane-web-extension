import { ChangeEvent, useEffect } from "react";
import { Radio, RadioGroup } from "@dashlane/design-system";
import { TOTAL_NUM_OF_PROFILING_QUESTIONS } from "../hooks/use-profile-admin-task";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ProfileAdminHeader } from "./profile-admin-header";
import { QuestionKey, QuestionProps, TeamSizePossibleAnswers } from "../types";
import { logProfileNewAdminPageView } from "../logs";
const I18N_KEYS = {
  CLOSE: "_common_dialog_dismiss_button",
  CARD_TITLE: "onb_profile_admin_employees_number_question_subtitle",
  CARD_DESCRIPTION: "onb_profile_admin_employees_number_question_description",
  QUESTION_NUMBER: "onb_profile_admin_questions_number",
  ANSWER_1: "onb_profile_admin_employees_number_question_50_size",
  ANSWER_2: "onb_profile_admin_employees_number_question_200_size",
  ANSWER_3: "onb_profile_admin_employees_number_question_500_size",
  ANSWER_4: "onb_profile_admin_employees_number_question_1000_size",
  ANSWER_5: "onb_profile_admin_employees_number_question_5000_size",
  ANSWER_6: "onb_profile_admin_employees_number_question_5001_plus_size",
};
export const TeamSizeQuestion = ({
  answers,
  questionNumber,
  setAnswers,
}: QuestionProps) => {
  const { translate } = useTranslate();
  useEffect(() => {
    logProfileNewAdminPageView(QuestionKey.TEAMSIZE);
  }, []);
  const handleChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswers([e.target.value]);
  };
  const optionsList = [
    {
      label: I18N_KEYS.ANSWER_1,
      optionKey: TeamSizePossibleAnswers.OneToFifty,
    },
    {
      label: I18N_KEYS.ANSWER_2,
      optionKey: TeamSizePossibleAnswers.FiftyOneToTwoHundred,
    },
    {
      label: I18N_KEYS.ANSWER_3,
      optionKey: TeamSizePossibleAnswers.TwoHundredOneToFiveHundred,
    },
    {
      label: I18N_KEYS.ANSWER_4,
      optionKey: TeamSizePossibleAnswers.FiveHundredOneToOneThousand,
    },
    {
      label: I18N_KEYS.ANSWER_5,
      optionKey: TeamSizePossibleAnswers.OneThousandOneToFiveThousand,
    },
    {
      label: I18N_KEYS.ANSWER_6,
      optionKey: TeamSizePossibleAnswers.FiveThousandOnePlus,
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
        groupName="Employee Number Question Answers"
        value={selectedAnswer}
        onChange={handleChangeCheckbox}
      >
        {optionsList.map(({ label, optionKey }) => (
          <Radio key={label} label={translate(label)} value={optionKey} />
        ))}
      </RadioGroup>
    </>
  );
};
