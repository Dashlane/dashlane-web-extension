import * as React from 'react';
import { queryByText, render } from '@testing-library/react';
import { I18nContextProvider } from 'libs/i18n/I18nContext';
import withTranslate from 'libs/i18n/withTranslate';
import { InjectedTranslateProps } from 'libs/i18n/types';
jest.mock('libs/i18n/useTranslate');
interface EmptyProps {
}
const TestComponent: React.FunctionComponent<EmptyProps & InjectedTranslateProps> = props => {
    return <span>{props.translate('translation_key')}</span>;
};
describe('withTranslate', () => {
    it('should inject the translate function in the props', () => {
        const TestComponentWithTranslate = withTranslate(TestComponent);
        const { container } = render(<I18nContextProvider>
        <TestComponentWithTranslate />
      </I18nContextProvider>);
        expect(queryByText(container, 'translation_key')).not.toBeNull();
    });
});
