import * as PasswordGenerator from "@dashlane/password-generator";
export interface PasswordEvaluationRequest {
  password: string;
}
export interface PasswordEvaluationResult {
  feedback: PasswordGenerator.EvaluatePasswordFeedback;
  score: number;
}
