import {
  PasswordEvaluationRequest,
  PasswordEvaluationResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type HealthCommands = {
  evaluatePassword: Command<
    PasswordEvaluationRequest,
    PasswordEvaluationResult
  >;
};
