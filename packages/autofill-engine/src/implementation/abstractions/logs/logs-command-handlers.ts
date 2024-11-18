import { ExceptionType } from "@dashlane/communication";
import { BrowseComponent, Event, PageView } from "@dashlane/hermes";
import { AutofillEngineClientType } from "../../../Api/types/client-type";
import { HandlersForModuleCommands } from "../../commands/handlers";
import { logException } from "./exception-logs";
import { logFormSubmitHandler } from "./form-submit-log";
import { logRightClickMenuHandler } from "./right-click-menu-log";
import { sendPropertyCopiedActivityLogHandler } from "./activity-logs";
const handleLogError = (error: Error) => {
  if (!error.message.includes("TIMED_OUT")) {
    throw error;
  }
};
export const LogsCommandHandlers: HandlersForModuleCommands<
  | "logEvent"
  | "logPageView"
  | "logException"
  | "logFormSubmit"
  | "logRightClickMenu"
  | "sendPropertyCopiedActivityLog"
> = {
  logEvent: async (context, _actions, _sender, event: Event): Promise<void> => {
    await context.connectors.carbon.logEvent({ event }).catch(handleLogError);
  },
  logPageView: async (
    context,
    _actions,
    _sender,
    pageViewEvent: {
      pageView: PageView;
      browseComponent: BrowseComponent;
    }
  ): Promise<void> => {
    await context.connectors.carbon
      .logPageView(pageViewEvent)
      .catch(handleLogError);
  },
  logException: (context, _actions, _sender, source, data): Promise<void> => {
    const exceptionTypeMap: Record<AutofillEngineClientType, ExceptionType> = {
      [AutofillEngineClientType.Injected]: "injectedtsException",
      [AutofillEngineClientType.Webcards]: "webcardsException",
      [AutofillEngineClientType.Popup]: "popupException",
    };
    logException(
      data.message,
      exceptionTypeMap[source],
      context.connectors,
      () => {},
      {
        precisions: data.precisions,
        additionalInfo: data.additionalInfo,
      }
    );
    return Promise.resolve();
  },
  sendPropertyCopiedActivityLog: sendPropertyCopiedActivityLogHandler,
  logFormSubmit: logFormSubmitHandler,
  logRightClickMenu: logRightClickMenuHandler,
};
