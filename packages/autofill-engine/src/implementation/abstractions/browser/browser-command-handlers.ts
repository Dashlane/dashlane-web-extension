import { webappOpen } from "@dashlane/framework-infra/spi";
import { HandlersForModuleCommands } from "../../commands/handlers";
export const BrowserCommandHandlers: HandlersForModuleCommands<
  "openNewTabWithUrl" | "openWebapp"
> = {
  openNewTabWithUrl: async (context, _actions, _sender, url): Promise<void> => {
    await context.browserApi.tabs.create({ url });
  },
  openWebapp: async (_context, _actions, _sender, params): Promise<void> => {
    await webappOpen(params);
  },
};
