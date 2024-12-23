import { Provider as StoreProvider } from "react-redux";
import * as HistoryModule from "history";
import { Channel } from "ts-event-bus";
import { ToastProvider } from "@dashlane/design-system";
import { CarbonLifecycleProvider } from "@dashlane/carbon-api-consumers";
import { AppContextProvider } from "@dashlane/framework-react";
import { AnyModuleApis, ClientsOf } from "@dashlane/framework-contracts";
import { TranslatorInterface } from "../libs/i18n/types";
import { Router, RouterGlobalSettingsProvider } from "../libs/router";
import { I18nProvider } from "../libs/i18n/I18nContext";
import { AlertProvider } from "../libs/alert-notifications/alert-provider";
import { TOAST_PORTAL_ID } from "../webapp/variables";
import { Store } from "../store/create";
import AppContainer from "./container";
import AppReducer from "./reducer";
import { NamedRoutes } from "./routes/types";
import { AlertingErrorBoundary } from "../libs/error/alerting-error-boundary";
import { LogPageViewProvider } from "../libs/logs/log-page-view-context";
import { PrivacyConsent } from "../privacy-consent/privacy-consent";
import { BrazeProvider } from "../libs/braze/braze-provider";
import { DISPLAY_APP_EVENT_NAME } from "../loader/loader-event";
export interface AppProps {
  host: string;
  history: HistoryModule.History;
  store: Store;
  translate: TranslatorInterface;
  namedRoutes: NamedRoutes;
  routes: JSX.Element;
  coreClient: ClientsOf<AnyModuleApis>;
  carbonChannel: Channel;
}
const App = (props: AppProps) => {
  const globalRouteSettings = {
    host: props.host,
    reducer: AppReducer,
    store: props.store,
    translate: props.translate,
    routes: props.namedRoutes,
  };
  window.dispatchEvent(new Event(DISPLAY_APP_EVENT_NAME));
  return (
    <AppContainer store={props.store}>
      <AppContextProvider client={props.coreClient}>
        <CarbonLifecycleProvider channel={props.carbonChannel}>
          <Router history={props.history}>
            <StoreProvider store={props.store}>
              <I18nProvider value={{ translate: props.translate }}>
                <AlertProvider portalId="alert-popup-portal">
                  <ToastProvider
                    portalId={TOAST_PORTAL_ID}
                    defaultCloseActionLabel={props.translate(
                      "_common_toast_close_label"
                    )}
                    sectionName={props.translate("_common_toast_section_name")}
                    itemName={props.translate("_common_toast_item_name")}
                  >
                    <RouterGlobalSettingsProvider value={globalRouteSettings}>
                      <LogPageViewProvider>
                        <AlertingErrorBoundary
                          moduleName="leeloo-routes"
                          useCaseName={props.history.location.pathname}
                        >
                          <PrivacyConsent>
                            <BrazeProvider>{props.routes}</BrazeProvider>
                          </PrivacyConsent>
                        </AlertingErrorBoundary>
                      </LogPageViewProvider>
                    </RouterGlobalSettingsProvider>
                  </ToastProvider>
                </AlertProvider>
              </I18nProvider>
            </StoreProvider>
          </Router>
        </CarbonLifecycleProvider>
      </AppContextProvider>
    </AppContainer>
  );
};
export default App;
