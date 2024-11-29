import { getExtensionId } from "../../../libs/extension";
import { carbonConnector } from "../../../libs/carbon/connector";
export const initEnableWebAuthnAuthentication = async () => {
  const relyingPartyId = getExtensionId();
  if (!relyingPartyId) {
    throw new Error(
      "WebAuthn Authentication Enable cannot be started as extension Id is missing"
    );
  }
  const initEnable = await carbonConnector.initEnableWebAuthnAuthentication({
    relyingPartyId,
  });
  if (!initEnable.success) {
    throw new Error(
      "WebAuthn Authentication Enable cannot be completed as init was not possible"
    );
  }
  return initEnable;
};
