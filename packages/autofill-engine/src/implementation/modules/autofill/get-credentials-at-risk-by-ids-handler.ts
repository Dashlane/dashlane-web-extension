import { firstValueFrom } from "rxjs";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { isSuccess } from "@dashlane/framework-types";
import {
  hasAbTest,
  PWD_HEALTH_LABELS_AB_TEST,
  PWD_HEALTH_LABELS_VARIANT_NAME,
} from "../../../config/ab-tests";
import { checkHasInAppPasswordHealth } from "../../../config/feature-flips";
import { AutofillCredentialsAtRisk } from "../../../types";
export const getCredentialsAtRiskByIdsHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  credentialIds: string[]
) => {
  const isAbTestEnabled = await hasAbTest(
    context,
    PWD_HEALTH_LABELS_AB_TEST,
    PWD_HEALTH_LABELS_VARIANT_NAME
  );
  const isFFEnabled = await checkHasInAppPasswordHealth(context.connectors);
  if (isAbTestEnabled && isFFEnabled) {
    const result = await firstValueFrom(
      context.connectors.grapheneClient.passwordHealth.queries.filterCredentialsIds(
        {
          spaceId: null,
          credentialIds,
        }
      )
    );
    if (isSuccess(result)) {
      const credentialsAtRisk = result.data.reduce((acc, currentView) => {
        if (currentView.corruptionData?.riskType) {
          acc[currentView.id] = currentView.corruptionData.riskType;
        }
        return acc;
      }, {} as AutofillCredentialsAtRisk);
      actions.updateWebcardCredentialsAtRisk(
        AutofillEngineActionTarget.SenderFrame,
        credentialsAtRisk
      );
    }
  }
};
