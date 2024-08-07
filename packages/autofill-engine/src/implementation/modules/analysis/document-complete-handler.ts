import { GetLoginStatus } from "@dashlane/communication";
import { scriptingInsertCSS } from "@dashlane/webextensions-apis";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { BROWSER_MAIN_FRAME_ID } from "../../abstractions/messaging/common";
import { restorePersistentWebcard } from "../../abstractions/webcardPersistence/persistent-webcards";
import { updateUserDetailsAndAnalysisStatus } from "./utils";
const SECURITY_PATCH_CSS_FILE_PATH = "content/webui/webui-frame.css";
export const documentCompleteHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender
) => {
  if (!(sender.tab && typeof sender.frameId === "number" && sender.url)) {
    return;
  }
  const isLoggedIn = await context.connectors.carbon
    .getUserLoginStatus()
    .then(({ loggedIn }: GetLoginStatus) => loggedIn);
  actions.updateClientFrameId(
    AutofillEngineActionTarget.SenderFrame,
    sender.frameId
  );
  await updateUserDetailsAndAnalysisStatus(
    context.connectors,
    context.grapheneClient,
    actions,
    AutofillEngineActionTarget.SenderFrame,
    sender.url,
    isLoggedIn
  );
  actions.updateTabActiveInfo(
    AutofillEngineActionTarget.SenderFrame,
    sender.tab.highlighted || sender.tab.active
  );
  if (sender.frameId === BROWSER_MAIN_FRAME_ID && sender.tab.id) {
    try {
      await scriptingInsertCSS({
        target: { tabId: sender.tab.id },
        origin: "USER",
        files: [SECURITY_PATCH_CSS_FILE_PATH],
      });
    } catch {}
  }
  await restorePersistentWebcard(context, actions);
};
