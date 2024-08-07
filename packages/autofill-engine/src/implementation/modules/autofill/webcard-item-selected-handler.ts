import { VaultSourceType } from "@dashlane/autofill-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  WebauthnOperationType,
  WebcardItem,
  WebcardMetadataStore,
  WebcardMetadataType,
} from "../../../types";
import { AutofillEngineActionsWithOptions } from "../../abstractions/messaging/action-serializer";
import { isWebauthnRequestWebcardMetadata } from "../../commands/private-types";
import { webauthnGetUserConfirmedHandler } from "../authentication/webauthn/webauthn-get";
export const webcardItemSelectedHandler = (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  selectedItem: WebcardItem,
  metadata: WebcardMetadataStore,
  webcardId: string
): Promise<void> => {
  const webauthnMetadata = metadata[WebcardMetadataType.WebauthnRequest];
  if (webauthnMetadata) {
    if (!isWebauthnRequestWebcardMetadata(webauthnMetadata)) {
      throw new Error("Invalid webauthn metadata in selected webcard item");
    }
    const request = webauthnMetadata.request;
    if (request.type !== WebauthnOperationType.Get) {
      throw new Error("Wrong webauthn metadata type in selected webcard item");
    }
    if (selectedItem.itemType !== VaultSourceType.Passkey) {
      throw new Error("Wrong item type associated with webauthn metadata");
    }
    return webauthnGetUserConfirmedHandler(
      context,
      actions,
      sender,
      request,
      selectedItem.itemId,
      webcardId
    );
  }
  throw new Error("Unsupported webcard item");
};
