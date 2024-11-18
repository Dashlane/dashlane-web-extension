import { carbonConnector } from "../../../carbonConnector";
export function disableCredentialProtection(credentialId: string) {
  return carbonConnector.disableCredentialProtection({
    credentialId: credentialId,
  });
}
