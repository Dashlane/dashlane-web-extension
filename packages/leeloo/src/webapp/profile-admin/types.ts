import { Result } from "@dashlane/framework-types";
import { Answer } from "@dashlane/onboarding-contracts";
export interface QuestionProps {
  answers: string[];
  questionNumber: number;
  setAnswers: (answers: string[]) => Promise<Result<undefined>>;
}
export enum QuestionKey {
  USECASE = "USECASE",
  FAMILIARITY = "FAMILIARITY",
  TEAMSIZE = "TEAMSIZE",
  FEATURES = "FEATURES",
}
export type LogAnswer = Answer;
export enum FamiliarityPossibleAnswers {
  SuperFamiliar = "super_familiar",
  VeryFamiliar = "very_familiar",
  SomewhatVeryFamiliar = "somewhat_familiar",
  NotVeryFamiliar = "not_very_familiar",
  NotFamiliarAtAll = "not_familiar_at_all",
}
export enum UseCasePossibleAnswers {
  SecurePasswords = "members_use_strong_passwords",
  SharePasswords = "securely_share_passwords",
  StoreDataOnePlace = "store_passwords_in_one_place",
  ControlDataAccess = "control_revoked_members_password_access",
  None = "none",
}
export enum FeaturesPossibleAnswers {
  Scim = "scim",
  Sso = "sso",
  Jit = "just_in_time_provisioning",
  MassDeployment = "mass_deployment",
  Siem = "siem",
  NotSure = "not_sure",
}
export enum TeamSizePossibleAnswers {
  OneToFifty = "one_to_fifty",
  FiftyOneToTwoHundred = "fifty_one_to_two_hundred",
  TwoHundredOneToFiveHundred = "two_hundred_one_to_five_hundred",
  FiveHundredOneToOneThousand = "five_hundred_one_to_one_thousand",
  OneThousandOneToFiveThousand = "one_thousand_one_to_five_thousand",
  FiveThousandOnePlus = "five_thousand_one_plus",
}
