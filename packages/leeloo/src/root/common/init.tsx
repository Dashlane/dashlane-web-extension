import ReactDOM from "react-dom";
import { Store as ReduxStore } from "redux";
import { Channel as TsEventBusChannel } from "ts-event-bus";
import * as HistoryModule from "history";
import { ClientsOf } from "@dashlane/framework-contracts";
import { LowLevelChannel } from "@dashlane/framework-application";
import { iframe } from "@dashlane/browser-utils";
import { RoutingConfig } from "../../app/routes/types";
import { getNamedRoutes } from "../../app/routes/services";
import { initFavicon } from "./init-favicon";
import { initAppClient } from "./init-app-client";
import { initializeTranslator } from "../../libs/i18n";
import { initErrorHandling } from "./init-error-handling";
import { initStore } from "./init-store";
import { listenToBackendEvents } from "../../libs/carbon";
import { initHistory } from "./init-history";
import registerLogSending from "../../libs/logs/register";
import { TranslatorInterface } from "../../libs/i18n/types";
import { LeelooDependencies } from "../../libs/application-dependencies";
import { __REDACTED__ } from "../../user/device";
export interface LeelooServices {
  appClient: ClientsOf<LeelooDependencies>;
  history: HistoryModule.History;
  store: ReduxStore;
  translator: TranslatorInterface;
}
export interface InitProps {
  channelToBackgroundGraphene: LowLevelChannel;
}
export const getContainerElement = () => {
  const container = document.getElementById("app");
  if (!container) {
    throw new Error("Unable to find app container DOM element");
  }
  return container;
};
export async function initServices(props: InitProps): Promise<LeelooServices> {
  const history = initHistory();
  const store = initStore();
  initErrorHandling(window, store);
  registerLogSending(store);
  if (iframe.isInsideIframe()) {
    throw new Error("Leeloo should not be run in an iframe");
  }
  const translator = await initializeTranslator(store);
  document.documentElement.lang = translator.getLocale();
  const appClient = await initAppClient(props.channelToBackgroundGraphene);
  listenToBackendEvents(store);
  return {
    appClient,
    history,
    store,
    translator,
  };
}
async function initRoutes(routingConfigLoader: () => Promise<RoutingConfig>) {
  const routingConfig = await routingConfigLoader();
  const namedRoutes = getNamedRoutes(routingConfig.scheme);
  const routes = routingConfig.getRoutes(namedRoutes);
  return {
    namedRoutes,
    routes,
  };
}
export interface RenderAppProps {
  services: LeelooServices;
  routingConfigLoader: () => Promise<RoutingConfig>;
  channelToBackgroundCarbon: TsEventBusChannel;
}
export async function renderApp(props: RenderAppProps) {
  const { services } = props;
  const { namedRoutes, routes } = await initRoutes(props.routingConfigLoader);
  initFavicon();
  const App = (await import("../../app")).default;
  ReactDOM.render(
    <App
      host={window.location.host}
      history={services.history}
      store={services.store}
      translate={services.translator}
      namedRoutes={namedRoutes}
      routes={routes}
      coreClient={services.appClient}
      carbonChannel={props.channelToBackgroundCarbon}
    />,
    getContainerElement()
  );
}
