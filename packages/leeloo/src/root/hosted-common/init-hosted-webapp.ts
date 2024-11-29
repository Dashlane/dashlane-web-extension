import { initBackground, initBackgroundWorker } from "./init-background";
import { startWebappActivityMonitor } from "./hosted-webapp-activity-detector";
import { getContainerElement, initServices } from "../common/init";
import { initLoginStatus } from "../common/init-login-status";
import { initCommunication } from "./init-communication";
import { initFileUpload } from "./init-file-upload";
import { initFileDownload } from "./init-file-download";
export async function initHostedWebapp() {
  const worker = initBackgroundWorker();
  startWebappActivityMonitor(worker);
  const channels = initCommunication(worker);
  const services = await initServices({
    channelToBackgroundGraphene: channels.channelToBackgroundGraphene,
  });
  initFileUpload(worker);
  initFileDownload(worker);
  const appBuildTypeServerOverride =
    getContainerElement().getAttribute("data-build-type") ?? "";
  await initBackground(
    worker,
    services.translator,
    channels.channelToBackgroundGraphene,
    appBuildTypeServerOverride
  );
  await initLoginStatus(services.store, services.appClient);
  return { services, channels };
}
