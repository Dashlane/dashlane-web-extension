import * as React from 'react';
import { queryByText, render } from '@testing-library/react';
import useTranslate from 'libs/i18n/useTranslate';
import { I18nContextProvider } from './I18nContext';
jest.mock('libs/i18n/useTranslate');
describe('useTranslate', () => {
    it('should return the translate function', () => {
        const TestComponent = (): React.FunctionComponentElement<{}> => {
            const { translate } = useTranslate();
            return <span>{translate('translation_key')}</span>;
        };
        const { container } = render(<I18nContextProvider>
        <TestComponent />
      </I18nContextProvider>);
        expect(queryByText(container, 'translation_key')).not.toBeNull();
    });
});
