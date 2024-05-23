import * as React from 'react';
import { render } from '@testing-library/react';
import Header, { HeaderProps } from 'app/login/Header';
jest.mock('libs/i18n/useTranslate');
const mockGrapheneCommands = {
    logout: jest.fn(),
};
jest.mock('@dashlane/framework-react', () => ({
    useModuleCommands: () => mockGrapheneCommands,
}));
jest.mock('kernel', () => ({
    kernel: {
        browser: {
            closePopover: jest.fn(),
        },
    },
}));
const email1 = '*****';
const email2 = '*****';
const email3 = '*****';
const localAccountsLogin = [email1, email2, email3];
const headerProps: HeaderProps = {
    login: email1,
    localAccountsLogin,
    onSelectLogin: jest.fn(),
    onOtherAccountClick: jest.fn(),
    onNewAccountClick: jest.fn(),
    setAnimationRunning: jest.fn(),
    showLogoutDropdown: false,
};
describe("Login's Header", () => {
    describe('Dropdown Menu', () => {
        it("should display current user's email when closed", () => {
            const { getByText } = render(<Header {...headerProps}/>);
            expect(getByText(headerProps.login)).toBeInTheDocument();
        });
        it('should show current local accounts, "Use an other account button" and "Create a new account" when it\'s clicked', () => {
            const { getByText, queryAllByText } = render(<Header {...headerProps}/>);
            getByText(email1).click();
            expect(queryAllByText(email1).length).toBe(2);
            expect(getByText(email2)).toBeInTheDocument();
            expect(getByText(email3)).toBeInTheDocument();
            expect(getByText('login/action_other_account')).toBeInTheDocument();
            expect(getByText('login/action_new_account')).toBeInTheDocument();
        });
    });
});
