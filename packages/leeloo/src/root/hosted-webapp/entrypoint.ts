import { renderApp } from "../common/init";
import { initHostedWebapp } from "../hosted-common/init-hosted-webapp";
const routingConfigLoader = async () =>
  (await import("../../app/routes/routes-client")).default;
async function initHostedPersonalWebApp() {
  const { services, channels } = await initHostedWebapp();
  renderApp({
    services,
    routingConfigLoader,
    channelToBackgroundCarbon: channels.channelToBackgroundCarbon,
  });
}
initHostedPersonalWebApp();
