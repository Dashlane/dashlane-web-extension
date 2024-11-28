import * as React from "react";
import { Provider } from "react-redux";
import { defaultTheme, ThemeProvider } from "@dashlane/ui-components";
import {
  ColorModeProvider,
  defaultTheme as dsTheme,
  mergeThemes,
  useColorMode,
} from "@dashlane/design-system";
import { AppContextProvider } from "@dashlane/framework-react";
import { CarbonLifecycleProvider } from "@dashlane/carbon-api-consumers";
import { I18nContextProvider } from "../libs/i18n/I18nContext";
import { popupToCarbonChannel } from "../carbonConnector/connector";
import { DASHLANE_DARK_THEME_KEY } from "../libs/local-storage-constants";
import { AlertingErrorBoundary } from "../libs/error/alerting-error-boundary";
import { Kernel } from "../kernel";
import store from "../store";
import "./app.css";
import { MainContainer } from "./main-container";
import { AuthenticationWrapper } from "./authentication-flow/authentication-wrapper";
interface AppProps {
  kernel: Kernel;
}
const DarkModeWrapper: React.FC = ({ children }) => {
  const [, setColorMode] = useColorMode();
  React.useLayoutEffect(() => {
    const isDarkThemeEnabled = window.localStorage.getItem(
      DASHLANE_DARK_THEME_KEY
    );
    setColorMode(isDarkThemeEnabled === "true" ? "dark" : "light");
    document.documentElement.style.setProperty(
      "color-scheme",
      isDarkThemeEnabled ? "dark" : "light"
    );
  }, [setColorMode]);
  return <>{children}</>;
};
export const App = ({ kernel }: AppProps) => {
  return (
    <AppContextProvider client={kernel.coreClient}>
      <CarbonLifecycleProvider channel={popupToCarbonChannel}>
        <Provider store={store}>
          <ThemeProvider theme={mergeThemes(dsTheme, defaultTheme)}>
            <ColorModeProvider>
              <DarkModeWrapper>
                <I18nContextProvider>
                  <AlertingErrorBoundary
                    moduleName="popup-container"
                    useCaseName="AppContainer"
                  >
                    <AuthenticationWrapper>
                      <MainContainer kernel={kernel} />
                    </AuthenticationWrapper>
                  </AlertingErrorBoundary>
                </I18nContextProvider>
              </DarkModeWrapper>
            </ColorModeProvider>
          </ThemeProvider>
        </Provider>
      </CarbonLifecycleProvider>
    </AppContextProvider>
  );
};
