import { HandlersForModuleCommands } from "../../commands/handlers";
import { forgetPersistentWebcard } from "./persistent-webcards";
export const WebcardPersistenceCommandHandlers: HandlersForModuleCommands<"webcardClosed"> =
  {
    webcardClosed: async (
      context,
      actions,
      sender,
      webcardId: string
    ): Promise<void> => {
      await forgetPersistentWebcard(context, webcardId);
    },
  };
