import * as React from 'react';
import { Provider } from 'react-redux';
import { defaultTheme, ThemeProvider } from '@dashlane/ui-components';
import { ColorModeProvider, defaultTheme as dsTheme, mergeThemes, useColorMode, } from '@dashlane/design-system';
import { AppContextProvider } from '@dashlane/framework-react';
import { CarbonLifecycleProvider } from '@dashlane/carbon-api-consumers';
import { Kernel } from 'kernel';
import { App } from 'app/App';
import store from 'store/index';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { I18nContextProvider } from 'libs/i18n/I18nContext';
import { popupToCarbonChannel } from 'src/carbonConnector/connector';
import { DASHLANE_DARK_THEME_KEY } from 'src/libs/local-storage-constants';
import './styles.css';
interface AppContainerProps {
    kernel: Kernel;
}
const DarkModeWrapper: React.FC = ({ children }) => {
    const [, setColorMode] = useColorMode();
    React.useLayoutEffect(() => {
        const isDarkThemeEnabled = window.localStorage.getItem(DASHLANE_DARK_THEME_KEY);
        setColorMode(isDarkThemeEnabled === 'true' ? 'dark' : 'light');
    }, [setColorMode]);
    return <>{children}</>;
};
export const AppContainer = ({ kernel }: AppContainerProps) => {
    return (<AppContextProvider client={kernel.coreClient}>
      <CarbonLifecycleProvider channel={popupToCarbonChannel}>
        <Provider store={store}>
          <ThemeProvider theme={mergeThemes(dsTheme, defaultTheme)}>
            <ColorModeProvider>
              <DarkModeWrapper>
                <MuiThemeProvider>
                  <I18nContextProvider>
                    <App kernel={kernel}/>
                  </I18nContextProvider>
                </MuiThemeProvider>
              </DarkModeWrapper>
            </ColorModeProvider>
          </ThemeProvider>
        </Provider>
      </CarbonLifecycleProvider>
    </AppContextProvider>);
};
