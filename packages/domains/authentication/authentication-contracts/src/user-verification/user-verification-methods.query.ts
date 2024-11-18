import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export enum UserVerificationMethods {
  Biometrics = "Biometrics",
  Pin = "Pin",
  MasterPassword = "MasterPassword",
}
export class UserVerificationMethodsQuery extends defineQuery<
  UserVerificationMethods[]
>({ scope: UseCaseScope.User }) {}
