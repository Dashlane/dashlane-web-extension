import { browser } from "@dashlane/browser-utils";
import { ParsedURL } from "@dashlane/url-parser";
import { contextMenusCreate } from "@dashlane/webextensions-apis";
import { v4 as uuidv4 } from "uuid";
import {
  AutofillEngineConnectors,
  AutofillEngineContext,
  GlobalState,
} from "../../../Api/server/context";
import { BrowserApi } from "../../../Api/types/browser/browser-api";
import {
  AutofillEngineExceptionLogger,
  AutofillEngineMessageLogger,
} from "../../../Api/types/logger";
import { checkHasVortexEnabled } from "../../../config/feature-flips";
import { BrowserCommandHandlers } from "../../../implementation/abstractions/browser/browser-command-handlers";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../../implementation/abstractions/messaging/action-serializer";
import {
  AccountFrozenDropdownWebcardData,
  AutofillDropdownWebcardConfiguration,
  AutofillDropdownWebcardWarningType,
  RightClickInformations,
  SelfCorrectingDropdownWebcardData,
  WarningData,
  WebcardType,
} from "../../../types";
import {
  checkIsAccountFrozen,
  getPasswordLimitStatus,
} from "../../abstractions/vault/get";
import { isUrlUnsecure } from "../autofill/utils";
export const createRightClickMenu = async (
  browserApi: BrowserApi,
  messageLogger: AutofillEngineMessageLogger,
  exceptionLogger: AutofillEngineExceptionLogger,
  connectors: AutofillEngineConnectors,
  globalState: GlobalState
) => {
  const state = await globalState.get();
  if (state.isRightClickMenuLive) {
    return;
  }
  try {
    await browserApi.contextMenus.removeAll();
    const hasVortexEnabled = await checkHasVortexEnabled(connectors);
    const isPageCaptureAllowed = hasVortexEnabled && !browser.isSafari();
    const mainMenuId = await contextMenusCreate({
      title: "Dashlane",
      contexts: [isPageCaptureAllowed ? "all" : "editable"],
      id: isPageCaptureAllowed
        ? "dashlane-right-click-menu"
        : "correct-autofill",
    });
    if (isPageCaptureAllowed) {
      await contextMenusCreate({
        title: "Capture the page as zip",
        parentId: mainMenuId,
        id: "capture-page",
        contexts: ["all"],
      });
      await contextMenusCreate({
        title: "Select an item to autofill",
        parentId: mainMenuId,
        id: "correct-autofill",
        contexts: ["editable"],
      });
    }
    if (mainMenuId) {
      await globalState.set({
        ...state,
        isRightClickMenuLive: true,
      });
      if (!__REDACTED__) {
        messageLogger(
          `Successfully created the right-click menu with ID '${mainMenuId}'`,
          {
            timestamp: Date.now(),
          }
        );
      }
    }
  } catch (exception) {
    void globalState.set({
      ...state,
      isRightClickMenuLive: false,
    });
    exceptionLogger(exception, {
      message: "Failed to create the right-click menu",
      fileName: "userRightClickOnElementHandler.ts",
      funcName: "createRightClickMenu",
    });
  }
};
function getDropdownWarning(
  tabUrl: string,
  tabRootDomain: string,
  frameRootDomain: string,
  frameSandboxed: boolean
): WarningData {
  const defaultValues: WarningData = {
    warningType: AutofillDropdownWebcardWarningType.None,
    warningContext: "",
  };
  if (isUrlUnsecure(tabUrl)) {
    return {
      warningType: AutofillDropdownWebcardWarningType.UnsecureProtocol,
      warningContext: "",
    };
  }
  if (tabRootDomain && frameRootDomain && tabRootDomain !== frameRootDomain) {
    return {
      warningType: AutofillDropdownWebcardWarningType.UnsecureIframe,
      warningContext: `UIF@${frameRootDomain}`.slice(0, 50),
    };
  }
  if (frameSandboxed) {
    return {
      warningType: AutofillDropdownWebcardWarningType.UnsecureIframe,
      warningContext: `UIF@sandbox`.slice(0, 50),
    };
  }
  return defaultValues;
}
function buildSelfCorrectingDropdownWebcardData(
  tabUrl: string,
  tabRootDomain: string,
  frameRootDomain: string,
  rightClickInformation: RightClickInformations,
  webcardId = uuidv4()
): SelfCorrectingDropdownWebcardData {
  const { warningType, warningContext } = getDropdownWarning(
    tabUrl,
    tabRootDomain,
    frameRootDomain,
    rightClickInformation.frameSandboxed
  );
  return {
    webcardId,
    configuration: AutofillDropdownWebcardConfiguration.SelfCorrecting,
    webcardType: WebcardType.AutofillDropdown,
    formType: rightClickInformation.formClassification,
    srcElement: rightClickInformation,
    autofillRecipes: {},
    warningType,
    context: warningContext,
    fieldType: undefined,
    tabRootDomain,
    elementHasImpala: rightClickInformation.elementHasImpala,
  };
}
function buildAccountFrozenDropdownWebcardData(
  rightClickInformation: RightClickInformations,
  passwordLimit: number,
  webcardId = uuidv4()
): AccountFrozenDropdownWebcardData {
  return {
    autofillRecipes: {},
    configuration: AutofillDropdownWebcardConfiguration.AccountFrozen,
    formType: rightClickInformation.formClassification,
    srcElement: rightClickInformation,
    webcardId,
    webcardType: WebcardType.AutofillDropdown,
    passwordLimit,
  };
}
export const userRightClickOnElementHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  rightClickInfos: RightClickInformations
) => {
  if (!sender.tab?.url || !sender.url) {
    return;
  }
  const userLoginStatus = await context.connectors.carbon.getUserLoginStatus();
  if (!userLoginStatus.loggedIn) {
    await BrowserCommandHandlers.openWebapp(context, actions, sender, {});
    return;
  }
  const isUserAccountFrozen = (await checkIsAccountFrozen(context)).isB2CFrozen;
  const { limit: passwordLimit } = await getPasswordLimitStatus(context);
  if (isUserAccountFrozen && !passwordLimit) {
    context.logException(
      new Error("User is frozen but there is no known password limit")
    );
  }
  const frameRootDomain = new ParsedURL(sender.url).getRootDomain();
  const tabRootDomain = new ParsedURL(sender.tab.url).getRootDomain();
  const webcardData =
    isUserAccountFrozen && !!passwordLimit
      ? buildAccountFrozenDropdownWebcardData(rightClickInfos, passwordLimit)
      : buildSelfCorrectingDropdownWebcardData(
          sender.tab.url,
          tabRootDomain,
          frameRootDomain,
          rightClickInfos
        );
  actions.showWebcard(AutofillEngineActionTarget.MainFrame, webcardData);
};
