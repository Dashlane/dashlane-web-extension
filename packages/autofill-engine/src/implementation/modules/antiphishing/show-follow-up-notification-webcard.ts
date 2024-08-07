import { VaultAutofillViewInterfaces } from "@dashlane/autofill-contracts";
import { getQueryValue } from "@dashlane/framework-application";
import { isSuccess } from "@dashlane/framework-types";
import { v4 as uuidv4 } from "uuid";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  FollowUpNotificationWebcardData,
  FollowUpNotificationWebcardItem,
} from "../../../Api/types/webcards/follow-up-notification-webcard";
import { VaultIngredient, WebcardType } from "../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { checkIsAccountFrozen } from "../../abstractions/vault/get";
import { getFormattedFollowUpNotificationWebcardData } from "../autofill/get-formatted-webcard-item";
export async function showFollowUpNotificationWebcard<
  T extends keyof VaultAutofillViewInterfaces
>(
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  vaultIngredient: VaultIngredient,
  vaultItem: VaultAutofillViewInterfaces[T]
): Promise<void> {
  const webcardSettingsQuery = await getQueryValue(
    context.connectors.grapheneClient.autofillSettings.queries.getAutofillSettings()
  );
  if ((await checkIsAccountFrozen(context)).isB2CFrozen) {
    return;
  }
  if (
    isSuccess(webcardSettingsQuery) &&
    !webcardSettingsQuery.data.isFollowUpNotificationEnabled
  ) {
    return;
  }
  const webcardData = getFormattedFollowUpNotificationWebcardData(
    vaultItem,
    vaultIngredient.type
  );
  let key: keyof FollowUpNotificationWebcardItem;
  for (key in webcardData) {
    if (webcardData[key] === "") {
      delete webcardData[key];
    }
  }
  const followUpNotificationWebcard: FollowUpNotificationWebcardData = {
    webcardType: WebcardType.FollowUpNotification,
    webcardId: uuidv4(),
    formType: "",
    webcardData,
    copiedProperties: [vaultIngredient.property],
  };
  actions.storeFollowUpNotificationItemId(
    AutofillEngineActionTarget.MainFrame,
    webcardData.itemId
  );
  actions.showWebcard(
    AutofillEngineActionTarget.MainFrame,
    followUpNotificationWebcard
  );
}
