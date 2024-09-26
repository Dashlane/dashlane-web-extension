import { Credential, GeneratedPassword } from "@dashlane/communication";
import { getDomainForCredential } from "DataManagement/Credentials/get-domain-for-credential";
export function associateGeneratedPasswordsToCredential(
  generatedPasswords: GeneratedPassword[],
  cred: Credential
): GeneratedPassword[] {
  return generatedPasswords
    .filter(
      (p) =>
        !p.AuthId &&
        p.Domain === getDomainForCredential(cred) &&
        p.Password === cred.Password
    )
    .map((p) => ({ ...p, AuthId: cred.Id }));
}
export function findAssociatedCredential(
  generatedPassword: GeneratedPassword,
  credentials: Credential[]
): Credential | undefined {
  if (!generatedPassword?.AuthId) {
    return undefined;
  }
  return (credentials || []).find(
    (credential) => credential.Id === generatedPassword.AuthId
  );
}
