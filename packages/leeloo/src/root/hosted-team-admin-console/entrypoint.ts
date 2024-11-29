import { renderApp } from "../common/init";
import { initHostedWebapp } from "../hosted-common/init-hosted-webapp";
const routingConfigLoader = async () =>
  (await import("../../app/routes/routes-tac")).default;
async function initTeamAdminConsoleHostedWebApp() {
  const { services, channels } = await initHostedWebapp();
  renderApp({
    services,
    routingConfigLoader,
    channelToBackgroundCarbon: channels.channelToBackgroundCarbon,
  });
}
initTeamAdminConsoleHostedWebApp();
