import {
  ProfilingFamiliarityPossibleAnswers,
  ProfilingFeaturesPossibleAnswers,
  ProfilingTeamSizePossibleAnswers,
  ProfilingUseCasePossibleAnswers,
} from "@dashlane/hermes";
import {
  FamiliarityPossibleAnswers,
  FeaturesPossibleAnswers,
  QuestionKey,
  TeamSizePossibleAnswers,
  UseCasePossibleAnswers,
} from "../types";
const useCaseMapping: Record<
  UseCasePossibleAnswers,
  ProfilingUseCasePossibleAnswers
> = {
  [UseCasePossibleAnswers.None]: ProfilingUseCasePossibleAnswers.None,
  [UseCasePossibleAnswers.ControlDataAccess]:
    ProfilingUseCasePossibleAnswers.ControlRevokedMembersPasswordAccess,
  [UseCasePossibleAnswers.SecurePasswords]:
    ProfilingUseCasePossibleAnswers.MembersUseStrongPasswords,
  [UseCasePossibleAnswers.SharePasswords]:
    ProfilingUseCasePossibleAnswers.SecurelySharePasswords,
  [UseCasePossibleAnswers.StoreDataOnePlace]:
    ProfilingUseCasePossibleAnswers.StorePasswordsInOnePlace,
};
const familiarityMapping: Record<
  FamiliarityPossibleAnswers,
  ProfilingFamiliarityPossibleAnswers
> = {
  [FamiliarityPossibleAnswers.NotFamiliarAtAll]:
    ProfilingFamiliarityPossibleAnswers.NotFamiliarAtAll,
  [FamiliarityPossibleAnswers.NotVeryFamiliar]:
    ProfilingFamiliarityPossibleAnswers.NotVeryFamiliar,
  [FamiliarityPossibleAnswers.SomewhatVeryFamiliar]:
    ProfilingFamiliarityPossibleAnswers.SomewhatFamiliar,
  [FamiliarityPossibleAnswers.SuperFamiliar]:
    ProfilingFamiliarityPossibleAnswers.SuperFamiliar,
  [FamiliarityPossibleAnswers.VeryFamiliar]:
    ProfilingFamiliarityPossibleAnswers.VeryFamiliar,
};
const teamSizeMapping: Record<
  TeamSizePossibleAnswers,
  ProfilingTeamSizePossibleAnswers
> = {
  [TeamSizePossibleAnswers.FiveThousandOnePlus]:
    ProfilingTeamSizePossibleAnswers.FiveThousandOnePlus,
  [TeamSizePossibleAnswers.FiftyOneToTwoHundred]:
    ProfilingTeamSizePossibleAnswers.FiftyOneToTwoHundred,
  [TeamSizePossibleAnswers.FiveHundredOneToOneThousand]:
    ProfilingTeamSizePossibleAnswers.FiveHundredOneToOneThousand,
  [TeamSizePossibleAnswers.OneThousandOneToFiveThousand]:
    ProfilingTeamSizePossibleAnswers.OneThousandOneToFiveThousand,
  [TeamSizePossibleAnswers.OneToFifty]:
    ProfilingTeamSizePossibleAnswers.OneToFifty,
  [TeamSizePossibleAnswers.TwoHundredOneToFiveHundred]:
    ProfilingTeamSizePossibleAnswers.TwoHundredOneToFiveHundred,
};
const featuresMapping: Record<
  FeaturesPossibleAnswers,
  ProfilingFeaturesPossibleAnswers
> = {
  [FeaturesPossibleAnswers.Jit]:
    ProfilingFeaturesPossibleAnswers.JustInTimeProvisioning,
  [FeaturesPossibleAnswers.MassDeployment]:
    ProfilingFeaturesPossibleAnswers.MassDeployment,
  [FeaturesPossibleAnswers.NotSure]: ProfilingFeaturesPossibleAnswers.NotSure,
  [FeaturesPossibleAnswers.Siem]: ProfilingFeaturesPossibleAnswers.Siem,
  [FeaturesPossibleAnswers.Scim]: ProfilingFeaturesPossibleAnswers.Scim,
  [FeaturesPossibleAnswers.Sso]: ProfilingFeaturesPossibleAnswers.Sso,
};
export const mappings = {
  [QuestionKey.USECASE]: useCaseMapping,
  [QuestionKey.FAMILIARITY]: familiarityMapping,
  [QuestionKey.TEAMSIZE]: teamSizeMapping,
  [QuestionKey.FEATURES]: featuresMapping,
};
export const answerToLogMapper = (
  questionKey: QuestionKey,
  selectedAnswers: string[]
) => {
  return selectedAnswers.map((answer) => mappings[questionKey][answer]);
};
