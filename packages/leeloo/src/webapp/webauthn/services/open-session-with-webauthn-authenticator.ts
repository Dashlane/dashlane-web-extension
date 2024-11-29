import {
  InitOpenSessionWithWebAuthnAuthenticatorResult,
  InitOpenSessionWithWebAuthnAuthenticatorsInfo,
} from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
import { startAssertion } from "../helpers/credential";
export const openSessionWithWebAuthnAuthenticator = async (
  initOpenSessionResult:
    | InitOpenSessionWithWebAuthnAuthenticatorResult
    | undefined,
  login: string,
  authAbortSignal?: AbortSignal
) => {
  if (!initOpenSessionResult || !initOpenSessionResult.success) {
    throw new Error(
      "WebAuthn authentication - Init Open Sesion Result missing"
    );
  }
  const { publicKeyOptions } = initOpenSessionResult.response;
  const credential = await startAssertion(publicKeyOptions, authAbortSignal);
  const authenticator = initOpenSessionResult.response.authenticatorsInfo.find(
    (authenticatorInfo: InitOpenSessionWithWebAuthnAuthenticatorsInfo) => {
      return authenticatorInfo.credentialId === credential.id;
    }
  );
  const openSessionResult =
    await carbonConnector.openSessionWithWebAuthnAuthenticator({
      credential,
      login,
      isRoamingAuthenticator: authenticator?.isRoaming,
    });
  if (!openSessionResult.success) {
    throw new Error("WebAuthn authentication - Enable call on Carbon failed");
  }
  return openSessionResult;
};
