import {
  PremiumStatusSpaceItemView,
  VaultAutofillView,
} from "@dashlane/communication";
import { AutofillEngineContext } from "../../../../Api/server/context";
import { checkHasPasskeySupport } from "../../../../config/feature-flips";
import { FocusInformations, WebcardItem } from "../../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../../abstractions/messaging/action-serializer";
import {
  buildWebcardItemsForPasskeyAssertion,
  getFilteredPasskeysFromVault,
  isRpIdInvalidForEffectiveDomain,
  validateWebauthnRequestSender,
} from "./webauthn-common";
import { UserVerificationMethods } from "@dashlane/authentication-contracts";
import { getAvailableUserVerificationMethods } from "../user-verification/get-available-user-verification-methods";
export const buildWebcardItemsForWebauthnConditionalUi = async (
  context: AutofillEngineContext,
  sender: chrome.runtime.MessageSender,
  focusInformations: FocusInformations,
  premiumStatusSpaces: PremiumStatusSpaceItemView[],
  searchValue?: string
): Promise<
  {
    webcardItem: WebcardItem;
    vaultItem: VaultAutofillView;
  }[]
> => {
  const request = focusInformations.conditionalUiRequest;
  if (request?.mediation !== "conditional") {
    return [];
  }
  const { effectiveDomain } = validateWebauthnRequestSender(sender, request);
  const rpId = request.options.rpId ?? effectiveDomain;
  if (isRpIdInvalidForEffectiveDomain(rpId, effectiveDomain)) {
    return [];
  }
  if (
    request.options.userVerification === "required" &&
    (await context.connectors.carbon.getIsSSOUser())
  ) {
    return [];
  }
  const usablePasskeyItems = await getFilteredPasskeysFromVault(
    context,
    rpId,
    request.options.allowCredentials ?? [],
    searchValue
  );
  const result = await buildWebcardItemsForPasskeyAssertion(
    context,
    premiumStatusSpaces,
    usablePasskeyItems
  );
  const userVerificationRequested = request.options.userVerification;
  const availableMethods = await getAvailableUserVerificationMethods(context);
  const hasOnlyMpOrPinCheckUVMethod = availableMethods.every(
    (method) =>
      method === UserVerificationMethods.MasterPassword ||
      method === UserVerificationMethods.Pin
  );
  const needUserVerification =
    (userVerificationRequested === "preferred" &&
      !hasOnlyMpOrPinCheckUVMethod) ||
    userVerificationRequested === "required";
  if (needUserVerification) {
    return result.map(({ webcardItem, vaultItem }) => ({
      webcardItem: { ...webcardItem, closeOnSelect: false },
      vaultItem,
    }));
  }
  return result;
};
export const webauthnIsConditionalUiSupportedHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender
) => {
  let supported = false;
  try {
    const { loggedIn } = await context.connectors.carbon.getUserLoginStatus();
    supported = loggedIn && (await checkHasPasskeySupport(context.connectors));
  } catch (exception) {
    context.logException(exception, {
      message: "Error when checking for passkey support",
      fileName: "webauthn-conditional-ui.ts",
      funcName: "webauthnIsConditionalUiSupportedHandler",
    });
  }
  actions.webauthnConditionalUiSupported(
    AutofillEngineActionTarget.SenderFrame,
    supported
  );
};
