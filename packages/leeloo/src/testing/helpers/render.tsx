import React from 'react';
import { MemoryRouter } from 'libs/router';
import { render, RenderOptions } from '@testing-library/react';
import { defaultTheme, ThemeProvider } from '@dashlane/ui-components';
import { defaultTheme as dsTheme, mergeThemes } from '@dashlane/design-system';
export const renderWithTheme = (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) => render(<ThemeProvider theme={mergeThemes(dsTheme, defaultTheme)}>
      {ui}
    </ThemeProvider>, options);
export const renderWithRouter = (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) => render(<MemoryRouter>{ui}</MemoryRouter>, options);
export const renderWithThemeAndRouter = (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) => {
    const { rerender: rtlRerender, ...restRtl } = render(<ThemeProvider theme={mergeThemes(dsTheme, defaultTheme)}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>, options);
    const rerender: typeof rtlRerender = (renderUi) => {
        return rtlRerender(<ThemeProvider theme={mergeThemes(dsTheme, defaultTheme)}>
        <MemoryRouter>{renderUi}</MemoryRouter>
      </ThemeProvider>);
    };
    return {
        ...restRtl,
        rerender,
    };
};
