import { slot } from "ts-event-bus";
import { PasswordEvaluationRequest, PasswordEvaluationResult } from "./types";
export const healthCommandsSlots = {
  evaluatePassword: slot<PasswordEvaluationRequest, PasswordEvaluationResult>(),
};
