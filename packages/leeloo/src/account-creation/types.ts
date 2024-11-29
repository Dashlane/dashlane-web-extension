export const SIGN_UP_FLOW_COOKIE = "teamSignupPageData";
export enum AccountCreationFlowType {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  B2C = "b2c",
}
export enum AccountCreationStep {
  EnterAccountEmail = "enterAccountEmail",
  ChooseAccountType = "chooseAccountType",
  EnterMasterPassword = "enterMasterPassword",
  ConfirmMasterPassword = "confirmMasterPassword",
  EnterPinCode = "enterPinCode",
  ConfirmPinCode = "confirmPinCode",
  InstallExtensionB2C = "installExtensionB2C",
  InstallExtensionB2B = "installExtensionB2B",
  ExpiredInvitation = "expiredInvitation",
  PendingInvitation = "pendingInvitation",
}
