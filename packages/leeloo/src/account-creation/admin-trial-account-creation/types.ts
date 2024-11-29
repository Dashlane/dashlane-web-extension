export enum AdminTrialAccountCreationStep {
  SubmitTrialForm = "submitTrialForm",
  VerifyEmail = "verifyEmail",
  EnterAccountEmail = "enterAccountEmail",
  EnterMasterPassword = "enterMasterPassword",
  ConfirmMasterPassword = "confirmMasterPassword",
  InstallExtension = "installExtension",
}
export type StepConfiguration = {
  step: AdminTrialAccountCreationStep;
  disabled: boolean;
  done: boolean;
  label: string;
  skipped?: boolean;
};
