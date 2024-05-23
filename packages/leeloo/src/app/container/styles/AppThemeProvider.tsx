import * as React from 'react';
import { defaultTheme, ThemeProvider } from '@dashlane/ui-components';
import { ColorModeProvider, defaultTheme as dsTheme, mergeThemes, useColorMode, } from '@dashlane/design-system';
import '@dashlane/design-system/fonts/modern.css';
import { DASHLANE_DARK_THEME_KEY } from 'webapp/dashlane-labs/constants';
interface Props {
    children: React.ReactNode;
}
const DarkModeWrapper: React.FC = ({ children }) => {
    const [, setColorMode] = useColorMode();
    React.useLayoutEffect(() => {
        const isDarkThemeEnabled = window.localStorage.getItem(DASHLANE_DARK_THEME_KEY);
        setColorMode(isDarkThemeEnabled === 'true' ? 'dark' : 'light');
        document.documentElement.style.setProperty('color-scheme', isDarkThemeEnabled === 'true' ? 'dark' : 'light');
    }, [setColorMode]);
    return <>{children}</>;
};
export const AppThemeProvider = (props: Props) => {
    return (<ThemeProvider theme={mergeThemes(dsTheme, defaultTheme)}>
      <ColorModeProvider>
        <DarkModeWrapper>{props.children}</DarkModeWrapper>
      </ColorModeProvider>
    </ThemeProvider>);
};
