import { AutofillEngineContext } from "../../Api/server/context";
import { AutofillEngineCommands } from "../../Api/types/commands";
import { BrowserCommandHandlers } from "../abstractions/browser/browser-command-handlers";
import { LogsCommandHandlers } from "../abstractions/logs/logs-command-handlers";
import { AutofillEngineActionsWithOptions } from "../abstractions/messaging/action-serializer";
import { UserCommandHandlers } from "../abstractions/user/user-command-handlers";
import { WebcardPersistenceCommandHandlers } from "../abstractions/webcardPersistence/webcard-persistence-command-handlers";
import { AnalysisCommandHandlers } from "../modules/analysis/analysis-command-handlers";
import { AntiPhishingCommandHandlers } from "../modules/antiphishing/antiphishing-command-handlers";
import { AuthenticationCommandHandlers } from "../modules/authentication/authentication-command-handlers";
import { AutofillCommandHandlers } from "../modules/autofill/autofill-command-handlers";
import { DataCaptureCommandHandlers } from "../modules/dataCapture/data-capture-command-handlers";
type HandlersForCommands<T> = {
  [Command in keyof T]: T[Command] extends (...args: any) => void
    ? (
        context: AutofillEngineContext,
        actions: AutofillEngineActionsWithOptions,
        sender: chrome.runtime.MessageSender,
        ...parameters: Parameters<T[Command]>
      ) => Promise<void>
    : never;
};
export type HandlersForModuleCommands<K extends keyof AutofillEngineCommands> =
  Pick<HandlersForCommands<AutofillEngineCommands>, K>;
export const AutofillEngineCommandHandlers: HandlersForCommands<AutofillEngineCommands> =
  {
    ...AnalysisCommandHandlers,
    ...AuthenticationCommandHandlers,
    ...AutofillCommandHandlers,
    ...DataCaptureCommandHandlers,
    ...AntiPhishingCommandHandlers,
    ...WebcardPersistenceCommandHandlers,
    ...LogsCommandHandlers,
    ...UserCommandHandlers,
    ...BrowserCommandHandlers,
  };
