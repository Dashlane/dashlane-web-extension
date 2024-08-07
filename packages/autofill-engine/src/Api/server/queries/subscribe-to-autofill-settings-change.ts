import { GetAutofillSettingsQueryResult } from "@dashlane/autofill-contracts";
import { ClientsOf } from "@dashlane/framework-contracts";
import { isSuccess, Result } from "@dashlane/framework-types";
import {
  AutofillEngineActionTarget,
  makeAutofillEngineActionSerializer,
} from "../../../implementation/abstractions/messaging/action-serializer";
import { PortStore } from "../../../implementation/abstractions/messaging/page-to-worker-transport/port-store";
import { updateDomainAnalysisStatus } from "../../../implementation/modules/analysis/utils";
import { BrowserApi } from "../../types/browser/browser-api";
import { AutofillEngineMessageLogger } from "../../types/logger";
import { Subscription } from "../../types/observables";
import { AutofillEngineConnectors } from "../context";
import { makeAutofillEngineActionSender } from "../message";
import { queryActiveInjectableTabs } from "../tabs";
import { AutofillEngineApplicationDependencies } from "../application-dependencies";
let settingsSubscription: Subscription;
const onAutofillSettingsChange = async (
  browserApi: BrowserApi,
  connectors: AutofillEngineConnectors,
  openPorts: PortStore,
  messageLogger: AutofillEngineMessageLogger,
  grapheneClient: ClientsOf<AutofillEngineApplicationDependencies>
) => {
  const [tab] = await queryActiveInjectableTabs(browserApi);
  if (tab?.url) {
    const sendToTab = makeAutofillEngineActionSender({
      browserApi,
      messageLogger,
      tabId: tab.id ?? 0,
      openPorts,
    });
    const actionSender = makeAutofillEngineActionSerializer(sendToTab);
    await updateDomainAnalysisStatus(
      connectors,
      grapheneClient,
      actionSender,
      AutofillEngineActionTarget.AllFrames,
      tab.url
    );
  }
};
export const subscribeToAutofillSettingsChange = (
  browserApi: BrowserApi,
  connectors: AutofillEngineConnectors,
  openPorts: PortStore,
  messageLogger: AutofillEngineMessageLogger,
  grapheneClient: ClientsOf<AutofillEngineApplicationDependencies>
) => {
  if (settingsSubscription) {
    settingsSubscription.unsubscribe();
  }
  settingsSubscription = grapheneClient.autofillSettings.queries
    .getAutofillSettings()
    .subscribe((settings: Result<GetAutofillSettingsQueryResult>) => {
      if (isSuccess(settings)) {
        void onAutofillSettingsChange(
          browserApi,
          connectors,
          openPorts,
          messageLogger,
          grapheneClient
        );
      }
    });
};
