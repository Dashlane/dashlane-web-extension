import { useState } from 'react';
import { jsx } from '@dashlane/ui-components';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { Result } from '@dashlane/framework-types';
import { AccountEmailSelect } from './account-email-select';
import { AccountEmailWelcome } from './account-email-welcome';
import { openWebAppAndClosePopup } from 'src/app/helpers';
interface Props extends Omit<AuthenticationFlowContracts.AuthenticationFlowEmailView, 'step'> {
    sendEmail: (params: {
        login: string;
    }) => Promise<Result<undefined>>;
    clearInputError: () => void;
}
export const AccountEmailSelectContainer = (props: Props) => {
    const [showWelcomeStep, setShowWelcomeStep] = useState(!props.localAccounts || props.localAccounts.length === 0);
    const handleOnWelcomeLoginClick = () => {
        setShowWelcomeStep(false);
    };
    const handleOnWelcomeCreateAccountClick = () => {
        void openWebAppAndClosePopup({ route: '/signup' });
    };
    return showWelcomeStep ? (<AccountEmailWelcome onLoginClick={handleOnWelcomeLoginClick} onCreateAccountClick={handleOnWelcomeCreateAccountClick}/>) : (<AccountEmailSelect {...props}/>);
};
