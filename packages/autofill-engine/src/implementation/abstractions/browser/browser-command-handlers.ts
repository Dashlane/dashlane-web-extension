import { webappOpen } from "@dashlane/framework-infra/spi";
import { HandlersForModuleCommands } from "../../commands/handlers";
export const BrowserCommandHandlers: HandlersForModuleCommands<
  "openNewTabWithUrl" | "openWebapp" | "openPopup"
> = {
  openNewTabWithUrl: async (context, _actions, _sender, url): Promise<void> => {
    await context.browserApi.tabs.create({ url });
  },
  openWebapp: async (_context, _actions, _sender, params): Promise<void> => {
    await webappOpen(params);
  },
  openPopup: async (_context, _actions, _sender, params): Promise<void> => {
    try {
      await _context.browserApi.action.openPopup(params);
    } catch (err) {
      await webappOpen({});
    }
  },
};
