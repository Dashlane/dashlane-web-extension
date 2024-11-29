import { PremiumStatus } from "@dashlane/communication";
import {
  CallToAction,
  CancelPlanStep,
  FlowStep,
  SurveyAnswer as HermesSurveyAnswer,
  UserCancelPlanEvent,
  UserOpenPricingPageEvent,
  UserRestartPlanEvent,
  UserUpdatePaymentMethodEvent,
} from "@dashlane/hermes";
import { logEvent } from "../../libs/logs/logEvent";
import {
  getPlanBillingPeriod,
  getPlanNameForLogs,
} from "../../libs/account/helpers";
import { SurveyAnswer } from "./types";
const getHermesSurveyAnswer = (
  surveyAnswer?: SurveyAnswer
): HermesSurveyAnswer | undefined => {
  switch (surveyAnswer) {
    case SurveyAnswer.AUTOFILL_DOESNT_WORK:
      return HermesSurveyAnswer.AutofillDidntWorkAsExpected;
    case SurveyAnswer.TECHNICAL_ISSUES:
      return HermesSurveyAnswer.ThereWereTooManyTechnicalIssues;
    case SurveyAnswer.TOO_EXPENSIVE:
      return HermesSurveyAnswer.DashlaneIsTooExpensive;
    case SurveyAnswer.MISSING_FEATURES:
      return HermesSurveyAnswer.DashlaneDoesntHaveTheFeaturesINeed;
    default:
      return undefined;
  }
};
export const logCancellationEvent = (
  cancelPlanStep: CancelPlanStep,
  premiumStatus: PremiumStatus,
  surveyAnswer?: SurveyAnswer
) => {
  const planBillingPeriod = getPlanBillingPeriod(premiumStatus);
  const event = new UserCancelPlanEvent({
    cancelPlanStep,
    plan: getPlanNameForLogs(premiumStatus),
    planBillingPeriod,
    surveyAnswer: getHermesSurveyAnswer(surveyAnswer),
  });
  logEvent(event);
};
export const logPlansPageEvent = (callToAction: CallToAction) => {
  logEvent(new UserOpenPricingPageEvent({ callToAction }));
};
export const logPlanRestartEvent = (premiumStatus: PremiumStatus) => {
  const planBillingPeriod = getPlanBillingPeriod(premiumStatus);
  const event = new UserRestartPlanEvent({
    plan: getPlanNameForLogs(premiumStatus),
    planBillingPeriod,
  });
  logEvent(event);
};
export const logUserUpdatePaymentMethodEvent = (
  premiumStatus: PremiumStatus,
  flowStep: FlowStep
) => {
  const planBillingPeriod = getPlanBillingPeriod(premiumStatus);
  logEvent(
    new UserUpdatePaymentMethodEvent({
      flowStep,
      plan: getPlanNameForLogs(premiumStatus),
      planBillingPeriod,
    })
  );
};
