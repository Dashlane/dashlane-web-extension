import * as React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PageView } from '@dashlane/hermes';
import { openWebAppAndClosePopup } from 'app/helpers';
import { Enforce2FAOverlay } from 'src/app/enforce-2FA-overlay/enforce-2FA-overlay';
import { renderWithDialog } from 'src/mockModels/mockhelpers';
import { logPageView } from 'src/libs/logs/logEvent';
import { useShouldEnforceTwoFactorAuthentication } from './use-should-enforce-two-factor-authentication';
jest.mock('app/helpers', () => ({
    openWebAppAndClosePopup: jest.fn(),
}));
jest.mock('./use-should-enforce-two-factor-authentication');
jest.mock('libs/i18n/useTranslate');
const mockUseShouldEnforceTwoFactorAuthentication = useShouldEnforceTwoFactorAuthentication as jest.Mock;
jest.mock('libs/logs/logEvent', () => ({
    logPageView: jest.fn(),
}));
const mockedLogPageView = logPageView as jest.Mock<void>;
const mockGrapheneCommands = {
    logout: jest.fn(),
};
jest.mock('@dashlane/framework-react', () => ({
    useModuleCommands: () => mockGrapheneCommands,
}));
const I18N_KEYS = {
    LOGOUT: 'login/log_out',
    TURN_ON_2FA_CTA: 'login/two-factor-authentication-turn-on-cta',
    TFA_ENFORCED_TITLE: 'login/two-factor-authentication-turn-on-title',
    TFA_ENFORCED_DESCRIPTION: 'login/two-factor-authentication-admin-enforce',
};
describe('<Enforce2FAOverlay>', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should not display if user is not allowed', () => {
        mockUseShouldEnforceTwoFactorAuthentication.mockReturnValue(false);
        const { queryByText } = renderWithDialog(<Enforce2FAOverlay />);
        const turnOnCTA = queryByText(I18N_KEYS.TURN_ON_2FA_CTA);
        expect(turnOnCTA).not.toBeInTheDocument();
    });
    it('should not send a page view log if the 2FA is not enforced by the admin', () => {
        mockUseShouldEnforceTwoFactorAuthentication.mockReturnValue(false);
        renderWithDialog(<Enforce2FAOverlay />);
        expect(mockedLogPageView).not.toHaveBeenCalled();
    });
    it('should display if FF is enabled, admin enforces 2FA and 2FA info is fully loaded', () => {
        mockUseShouldEnforceTwoFactorAuthentication.mockReturnValue(true);
        const { queryByText } = renderWithDialog(<Enforce2FAOverlay />);
        const turnOnCTA = queryByText(I18N_KEYS.TURN_ON_2FA_CTA);
        expect(turnOnCTA).toBeInTheDocument();
        expect(mockedLogPageView).toHaveBeenCalledWith(PageView.LoginEnforce2faBusiness);
    });
    it('should open the WebApp if user clicks on the enforce CTA', async () => {
        mockUseShouldEnforceTwoFactorAuthentication.mockReturnValue(true);
        renderWithDialog(<Enforce2FAOverlay />);
        const turnOnCTA = await screen.findByText(I18N_KEYS.TURN_ON_2FA_CTA);
        userEvent.click(turnOnCTA);
        await waitFor(() => {
            expect(openWebAppAndClosePopup).toHaveBeenCalledTimes(1);
        });
    });
    it('should open the WebApp if user clicks on the logout CTA', async () => {
        mockUseShouldEnforceTwoFactorAuthentication.mockReturnValue(true);
        renderWithDialog(<Enforce2FAOverlay />);
        const turnOnCTA = await screen.findByText(I18N_KEYS.LOGOUT);
        userEvent.click(turnOnCTA);
        await waitFor(() => {
            expect(mockGrapheneCommands.logout).toHaveBeenCalledTimes(1);
        });
    });
});
