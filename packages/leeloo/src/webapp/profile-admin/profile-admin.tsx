import { useEffect, useRef, useState } from "react";
import { Card, Heading, useToast } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/framework-react";
import { Answer } from "@dashlane/onboarding-contracts";
import { useProfileAdminAnswers } from "./hooks/use-profile-admin-answers";
import {
  TOTAL_NUM_OF_PROFILING_QUESTIONS,
  useProfileAdminTask,
} from "./hooks/use-profile-admin-task";
import {
  Redirect,
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../libs/router";
import useTranslate from "../../libs/i18n/useTranslate";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
import { Header } from "../components/header/header";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { ProfileAdminFooter } from "./profile-admin-footer";
import { TeamSizeQuestion } from "./questions/team-size-question";
import { FamiliarityQuestion } from "./questions/familiarity-questions";
import { UseCaseQuestion } from "./questions/use-case-question";
import { FeatureQuestion } from "./questions/feature-question";
import { SX_STYLES } from "./styles";
import { Loader } from "../../team/components/loader";
import {
  logAskLaterClick,
  logProfilingFamiliarityAnswers,
  logProfilingTeamSizeAnswers,
  logProfilingUseCaseAnswers,
  triggerLastQuestionLog,
} from "./logs";
import { QuestionKey } from "./types";
import { answerToLogMapper } from "./mappers/answer-to-log-mappings";
const I18N_KEYS = {
  PAGE_TITLE: "onb_profile_admin_questions_main_title",
  TOAST_CONGRATS: "onb_profile_admin_questions_toast_congrats",
  TOAST_FINISH_LATER: "onb_profile_admin_questions_toast_finish_later",
  BUTTON_COMPLETE: "onb_profile_admin_questions_button_complete",
  BUTTON_CONTINUE: "onb_profile_admin_questions_button_continue",
  BUTTON_DO_LATER: "onb_profile_admin_questions_button_do_later",
  BUTTON_GO_BACK: "onb_profile_admin_questions_button_back",
};
const defaultAnswer: Answer = {
  questionKey: "",
  completed: false,
  selectedAnswers: [],
};
export const questionComponents = [
  UseCaseQuestion,
  FamiliarityQuestion,
  TeamSizeQuestion,
  FeatureQuestion,
];
export const ProfileAdmin = () => {
  const history = useHistory();
  const { showToast } = useToast();
  const { translate } = useTranslate();
  const profileAdminTask = useProfileAdminTask();
  const profileAdminAnswers = useProfileAdminAnswers();
  const {
    routes: { userOnboarding },
  } = useRouterGlobalSettingsContext();
  const [hasBeenInitialized, setHasBeenInitialized] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const hasCompletedAllQuestions = useRef<boolean>(false);
  const hasStartedSurvey = useRef<boolean>(false);
  const setAnswer = (selectedAnswers: string[], completed: boolean) => {
    return profileAdminAnswers.saveAnswer({
      questionKey: `questionKey-{${currentQuestionIndex}}`,
      completed,
      selectedAnswers,
    });
  };
  const handleBackSurvey = () => {
    const isFirstQuestion = currentQuestionIndex === 0;
    if (isFirstQuestion) {
      logAskLaterClick();
      history.push(userOnboarding);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const sendCurrentQuestionLog = (selectedAnswers: string[]) => {
    const logFunctions: Array<{
      key: QuestionKey;
      logger?: (selectedAnswers: string[]) => void;
    }> = [
      { key: QuestionKey.USECASE, logger: logProfilingUseCaseAnswers },
      { key: QuestionKey.FAMILIARITY, logger: logProfilingFamiliarityAnswers },
      { key: QuestionKey.TEAMSIZE, logger: logProfilingTeamSizeAnswers },
      { key: QuestionKey.FEATURES, logger: undefined },
    ];
    const { logger, key } = logFunctions[currentQuestionIndex];
    if (logger) {
      logger(answerToLogMapper(key, selectedAnswers));
    } else {
      console.error("Invalid question index:", currentQuestionIndex);
    }
  };
  const handleNextSurvey = (answer: Answer) => {
    const isLastQuestion =
      currentQuestionIndex === questionComponents.length - 1;
    if (isLastQuestion) {
      if (profileAdminAnswers.status === DataStatus.Success) {
        triggerLastQuestionLog([...profileAdminAnswers.answers, answer]);
      }
      hasCompletedAllQuestions.current = true;
    }
    setAnswer(answer.selectedAnswers, true).then(() => {
      if (!isLastQuestion) {
        sendCurrentQuestionLog(answer.selectedAnswers);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    });
  };
  useEffect(() => {
    if (profileAdminTask.status === DataStatus.Success && !hasBeenInitialized) {
      const questionIdx =
        TOTAL_NUM_OF_PROFILING_QUESTIONS -
        profileAdminTask.profilingRemainingQuestions;
      setCurrentQuestionIndex(questionIdx ?? 0);
      setHasBeenInitialized(true);
    }
  }, [hasBeenInitialized, profileAdminTask]);
  useEffect(() => {
    if (profileAdminAnswers.status === DataStatus.Success) {
      if (profileAdminAnswers.answers.length !== 0) {
        hasStartedSurvey.current =
          profileAdminAnswers.answers[0].completed ||
          profileAdminAnswers.answers[0].selectedAnswers.length !== 0;
      }
    }
  }, [profileAdminAnswers]);
  useEffect(() => {
    return () => {
      if (hasStartedSurvey.current && !hasCompletedAllQuestions.current) {
        showToast({
          description: translate(I18N_KEYS.TOAST_FINISH_LATER),
        });
      } else if (hasCompletedAllQuestions.current) {
        showToast({
          description: translate(I18N_KEYS.TOAST_CONGRATS),
        });
      }
    };
  }, [showToast, translate]);
  if (
    profileAdminAnswers.status !== DataStatus.Success ||
    profileAdminTask.status !== DataStatus.Success
  ) {
    return <Loader />;
  }
  if (
    profileAdminTask.status === DataStatus.Success &&
    !profileAdminTask.isProfilingAdminTodo
  ) {
    return <Redirect to={userOnboarding} />;
  }
  const currentAnswer =
    profileAdminAnswers.answers[currentQuestionIndex] ?? defaultAnswer;
  const CurrentQuestionComponent = questionComponents[currentQuestionIndex];
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "ds.container.agnostic.neutral.standard",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        padding: "16px 32px 32px",
      }}
    >
      <Header
        startWidgets={
          <Heading
            as="h1"
            textStyle="ds.title.section.large"
            color="ds.text.neutral.catchy"
          >
            {translate(I18N_KEYS.PAGE_TITLE)}
          </Heading>
        }
        endWidget={
          <>
            <HeaderAccountMenu />
            <NotificationsDropdown />
          </>
        }
      >
        {translate(I18N_KEYS.PAGE_TITLE)}
      </Header>

      <Card sx={SX_STYLES.OUTER_CARD}>
        <div sx={SX_STYLES.INNER_CARD}>
          <CurrentQuestionComponent
            answers={currentAnswer.selectedAnswers}
            setAnswers={(answers: string[]) =>
              setAnswer(answers, currentAnswer.completed)
            }
            questionNumber={currentQuestionIndex + 1}
          />

          <ProfileAdminFooter
            handleBack={handleBackSurvey}
            handleForward={() => handleNextSurvey(currentAnswer)}
            backButtonText={
              currentQuestionIndex === 0
                ? translate(I18N_KEYS.BUTTON_DO_LATER)
                : translate(I18N_KEYS.BUTTON_GO_BACK)
            }
            forwardButtonText={
              currentQuestionIndex === TOTAL_NUM_OF_PROFILING_QUESTIONS - 1
                ? translate(I18N_KEYS.BUTTON_COMPLETE)
                : translate(I18N_KEYS.BUTTON_CONTINUE)
            }
            backIcon={
              currentQuestionIndex === 0 ? undefined : "ArrowLeftOutlined"
            }
            forwardIcon="ArrowRightOutlined"
          />
        </div>
      </Card>
    </div>
  );
};
