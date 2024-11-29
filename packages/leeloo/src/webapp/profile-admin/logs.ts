import {
  Button,
  ClickOrigin,
  PageView,
  ProfilingFamiliarityPossibleAnswers,
  ProfilingFeaturesPossibleAnswers,
  ProfilingStep,
  ProfilingTeamSizePossibleAnswers,
  ProfilingUseCasePossibleAnswers,
  UserClickEvent,
  UserSubmitAdminProfilingQuestionsEvent,
} from "@dashlane/hermes";
import { logEvent, logPageView } from "../../libs/logs/logEvent";
import { LogAnswer, QuestionKey } from "./types";
import { answerToLogMapper } from "./mappers/answer-to-log-mappings";
export const logAskLaterClick = () => {
  void logEvent(
    new UserClickEvent({
      button: Button.AskLater,
      clickOrigin: ClickOrigin.AdminProfiling,
    })
  );
};
export const logProfileNewAdminPageView = (question: QuestionKey) => {
  logPageView(
    {
      [QuestionKey.USECASE]: PageView.TacTeamCreatorProfilingUseCase,
      [QuestionKey.TEAMSIZE]: PageView.TacTeamCreatorProfilingTeamSize,
      [QuestionKey.FEATURES]: PageView.TacTeamCreatorProfilingFeatures,
      [QuestionKey.FAMILIARITY]:
        PageView.TacTeamCreatorProfilingFamiliarityWithPasswordManagers,
    }[question]
  );
};
export const logProfilingUseCaseAnswers = (
  selectedAnswers: ProfilingUseCasePossibleAnswers[]
) => {
  logEvent(
    new UserSubmitAdminProfilingQuestionsEvent({
      profilingStep: ProfilingStep.UseCase,
      isProfilingComplete: false,
      useCaseChoiceList: Object.values(ProfilingUseCasePossibleAnswers),
      useCaseAnswerList: selectedAnswers,
    })
  );
};
export const logProfilingFamiliarityAnswers = (
  selectedAnswers: ProfilingFamiliarityPossibleAnswers[]
) => {
  logEvent(
    new UserSubmitAdminProfilingQuestionsEvent({
      profilingStep: ProfilingStep.FamiliarityWithPasswordManagers,
      isProfilingComplete: false,
      adminFamiliarityChoiceList: Object.values(
        ProfilingFamiliarityPossibleAnswers
      ),
      adminFamiliarityAnswerList: selectedAnswers,
    })
  );
};
export const logProfilingTeamSizeAnswers = (
  selectedAnswers: ProfilingTeamSizePossibleAnswers[]
) => {
  logEvent(
    new UserSubmitAdminProfilingQuestionsEvent({
      profilingStep: ProfilingStep.TeamSize,
      isProfilingComplete: false,
      teamSizeChoiceList: Object.values(ProfilingTeamSizePossibleAnswers),
      teamSizeAnswerList: selectedAnswers,
    })
  );
};
export const triggerLastQuestionLog = (selectedAnswers: LogAnswer[]) => {
  const useCaseQuestion = {
    useCaseAnswerList: answerToLogMapper(
      QuestionKey.USECASE,
      selectedAnswers[0].selectedAnswers
    ),
    useCaseChoiceList: Object.values(ProfilingUseCasePossibleAnswers),
  };
  const familiarityQuestion = {
    adminFamiliarityAnswerList: answerToLogMapper(
      QuestionKey.FAMILIARITY,
      selectedAnswers[1].selectedAnswers
    ),
    adminFamiliarityChoiceList: Object.values(
      ProfilingFamiliarityPossibleAnswers
    ),
  };
  const teamSizeQuestion = {
    teamSizeAnswerList: answerToLogMapper(
      QuestionKey.TEAMSIZE,
      selectedAnswers[2].selectedAnswers
    ),
    teamSizeChoiceList: Object.values(ProfilingTeamSizePossibleAnswers),
  };
  const featuresQuestion = {
    featuresAnswerList: answerToLogMapper(
      QuestionKey.FEATURES,
      selectedAnswers[3].selectedAnswers
    ),
    featuresChoiceList: Object.values(ProfilingFeaturesPossibleAnswers),
  };
  logEvent(
    new UserSubmitAdminProfilingQuestionsEvent({
      isProfilingComplete: true,
      profilingStep: ProfilingStep.Features,
      ...useCaseQuestion,
      ...familiarityQuestion,
      ...teamSizeQuestion,
      ...featuresQuestion,
    })
  );
};
