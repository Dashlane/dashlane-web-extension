import { PossibleFormAnswers } from "@dashlane/hermes";
import {
  VALID_CANCEL_REASONS,
  ValidCancelReasons,
} from "@dashlane/team-admin-contracts";
export const hermesCancelReasonsMapper: Record<
  ValidCancelReasons,
  PossibleFormAnswers
> = {
  [VALID_CANCEL_REASONS.ChoseOtherPasswordManager]:
    PossibleFormAnswers.ChoseOtherPasswordManager,
  [VALID_CANCEL_REASONS.DownsizedEmployeeCount]:
    PossibleFormAnswers.DownsizedEmployeeCount,
  [VALID_CANCEL_REASONS.MissingCriticalFeatures]:
    PossibleFormAnswers.MissingCriticalFeatures,
  [VALID_CANCEL_REASONS.NoInternalUsage]: PossibleFormAnswers.NoInternalUsage,
  [VALID_CANCEL_REASONS.Other]: PossibleFormAnswers.Other,
  [VALID_CANCEL_REASONS.TechnicalIssues]: PossibleFormAnswers.TechnicalIssues,
  [VALID_CANCEL_REASONS.TooExpensive]: PossibleFormAnswers.TooExpensive,
};
