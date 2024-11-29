import { initServices, renderApp } from "../common/init";
import { initLoginStatus } from "../common/init-login-status";
import { checkBackgroundStatus } from "./check-background-status";
import { attemptToOpenExtensionSession } from "./extension-carbon";
import { initCommunication } from "./init-communication";
import { initFileDownloadListenerForExtension } from "./init-file-download";
import { initFileUpload } from "./init-file-upload";
async function initExtensionWebApp() {
  void checkBackgroundStatus();
  const channels = initCommunication();
  const services = await initServices({
    channelToBackgroundGraphene: channels.channelToBackgroundGraphene,
  });
  initFileUpload();
  initFileDownloadListenerForExtension();
  await attemptToOpenExtensionSession(services.store);
  await initLoginStatus(services.store, services.appClient);
  await renderApp({
    services,
    channelToBackgroundCarbon: channels.channelToBackgroundCarbon,
    routingConfigLoader: async () =>
      (
        await import("../../app/routes/routes-client")
      ).default,
  });
}
initExtensionWebApp();
