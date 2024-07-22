import { AnyFunctionalError } from "@dashlane/framework-types";
export interface CommandError extends AnyFunctionalError {
  errorMessage: string;
}
