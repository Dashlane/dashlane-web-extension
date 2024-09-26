export enum AutofillOptions {
  ANALYSIS_ENABLED_ON_ALL_FORMS = "ANALYSIS_ENABLED_ON_ALL_FORMS",
  ANALYSIS_ENABLED_ONLY_ON_LOGINS_AND_PASSWORDS = "ANALYSIS_ENABLED_ONLY_ON_LOGINS_AND_PASSWORDS",
}
export type SingleCredentialDataQuery = {
  credentialId: string;
  rootDomain: string;
};
