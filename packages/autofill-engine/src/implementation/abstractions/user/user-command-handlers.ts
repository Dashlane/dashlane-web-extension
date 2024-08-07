import { getQueryValue } from "@dashlane/framework-application";
import { isSuccess } from "@dashlane/framework-types";
import { GetLoginStatus } from "@dashlane/communication";
import { fetchFeatureFlips } from "../../../config/feature-flips";
import { HandlersForModuleCommands } from "../../commands/handlers";
import { AutofillEngineActionTarget } from "../messaging/action-serializer";
export const UserCommandHandlers: HandlersForModuleCommands<
  "getUserSubscriptionCode" | "getUserFeatureFlips"
> = {
  getUserSubscriptionCode: async (context, actions): Promise<void> => {
    if ((await context.connectors.carbon.getUserLoginStatus()).loggedIn) {
      const subscriptionCode = await getQueryValue(
        context.connectors.grapheneClient.subscriptionCode.queries.getSubscriptionCode()
      );
      actions.updateUserSubscriptionCode(
        AutofillEngineActionTarget.SenderFrame,
        isSuccess(subscriptionCode) ? subscriptionCode.data : ""
      );
    }
  },
  getUserFeatureFlips: async (context, actions): Promise<void> => {
    let features = {};
    const { loggedIn }: GetLoginStatus =
      await context.connectors.carbon.getUserLoginStatus();
    if (loggedIn) {
      features = await fetchFeatureFlips(context.connectors);
    }
    actions.updateUserFeatureFlips(
      AutofillEngineActionTarget.SenderFrame,
      features
    );
  },
};
