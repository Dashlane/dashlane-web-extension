import {
  ActivityLogType,
  UserPerformedAutofillCredential,
  UserPerformedAutofillPayment,
} from "@dashlane/risk-monitoring-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import { AutofillPerformedInfos } from "../../../types";
import { AutofillEngineActionsWithOptions } from "../../abstractions/messaging/action-serializer";
import { ParsedURL } from "@dashlane/url-parser";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import { makeItemUsageActivityLog } from "../../abstractions/logs/activity-logs";
export const logAutofillPerformedEventHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  infos: AutofillPerformedInfos
): Promise<void> => {
  const { temporaryEmitPasswordAutofillPerformedEvent } =
    context.connectors.grapheneClient.autofillTracking.commands;
  let log: UserPerformedAutofillCredential | UserPerformedAutofillPayment;
  if (infos.type === VaultSourceType.Credential) {
    log = makeItemUsageActivityLog<UserPerformedAutofillCredential>(
      ActivityLogType.UserPerformedAutofillCredential,
      {
        credential_login: infos.login,
        credential_domain: infos.domain,
        autofilled_domain: new ParsedURL(sender.url).getHostname(),
      }
    );
    await temporaryEmitPasswordAutofillPerformedEvent({
      credentialId: infos.id,
    });
  } else {
    log = makeItemUsageActivityLog<UserPerformedAutofillPayment>(
      ActivityLogType.UserPerformedAutofillPayment,
      {
        item_name: infos.item_name,
        item_type:
          infos.type === VaultSourceType.BankAccount
            ? "bank_account"
            : "credit_card",
        autofilled_domain: new ParsedURL(sender.url).getHostname(),
      }
    );
  }
  const premiumStatus = await context.connectors.carbon.getNodePremiumStatus();
  if (premiumStatus.b2bStatus?.currentTeam) {
    await context.connectors.grapheneClient.activityLogs.commands.storeActivityLogs(
      {
        activityLogs: [log],
      }
    );
  }
};
