import { carbonConnector } from "../../../libs/carbon/connector";
import {
  PublicKeyCredentialEnableOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  WebAuthnCallTypes,
} from "@dashlane/communication";
import { EnableWebAuthnAuthenticationResult } from "./types";
import { startAssertion } from "../helpers/credential";
export const enableWebAuthnAuthenticationWithAssertion = async (
  publicKeyJSON: PublicKeyCredentialEnableOptionsJSON
): Promise<EnableWebAuthnAuthenticationResult> => {
  const credential = await startAssertion(
    publicKeyJSON as PublicKeyCredentialRequestOptionsJSON
  );
  const authenticationType = WebAuthnCallTypes.GET;
  const result = await carbonConnector.enableWebAuthnAuthentication({
    authenticationType,
    credential,
  });
  return {
    success: result.success,
    data: {
      authenticationType,
    },
  };
};
