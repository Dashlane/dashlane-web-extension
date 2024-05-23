import { Fragment, useEffect, useState } from 'react';
import { Dialog, jsx } from '@dashlane/ui-components';
import { PageView } from '@dashlane/hermes';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { DataStatus, useModuleCommands } from '@dashlane/framework-react';
import { useTwoFactorAuthentication } from 'webapp/two-factor-authentication/hooks';
import { useShouldEnforceTwoFactorAuthentication } from 'webapp/two-factor-authentication/business/hooks/use-should-enforce-two-factor-authentication';
import { InsideExtensionDialog } from '../components/inside-extension-dialog';
import { OutsideExtensionDialog } from '../components/outside-extension-dialog';
import { logPageView } from 'libs/logs/logEvent';
import { logTwoFactorAuthenticationEnableStartEvent } from 'webapp/two-factor-authentication/logs/enable-flow-logs';
import { useHistory } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
export const TwoFactorAuthenticationForBusinessContainer = () => {
    const [isInfoOpen, setInfoOpen] = useState(true);
    const shouldEnforceTwoFactorAuthentication = useShouldEnforceTwoFactorAuthentication();
    const history = useHistory();
    const { routes } = useRouterGlobalSettingsContext();
    const { logout } = useModuleCommands(AuthenticationFlowContracts.authenticationFlowApi);
    const handleOnTwoFactorEnableFlowChange = (isDialogOpened: boolean) => {
        if (!isDialogOpened) {
            setInfoOpen(true);
        }
    };
    const onSuccess = () => {
        history.push(routes.userCredentials);
    };
    useEffect(() => {
        if (shouldEnforceTwoFactorAuthentication.status === DataStatus.Success &&
            shouldEnforceTwoFactorAuthentication.data &&
            isInfoOpen) {
            logPageView(PageView.LoginEnforce2faBusiness);
        }
    }, [shouldEnforceTwoFactorAuthentication.status, isInfoOpen]);
    const { openTwoFactorAuthenticationEnablerDialog } = useTwoFactorAuthentication({
        onDialogStateChanged: handleOnTwoFactorEnableFlowChange,
        onSuccess: onSuccess,
    });
    const handleOnStart2FAEnableFlow = () => {
        logTwoFactorAuthenticationEnableStartEvent();
        openTwoFactorAuthenticationEnablerDialog();
        setInfoOpen(false);
    };
    const handleOnLogout = () => {
        logout();
    };
    return (<>
      <div id="dashlane-dialog"/>
      <Dialog isOpen={isInfoOpen} onClose={() => {
            setInfoOpen(true);
        }} ariaLabelledby="dialogTitle" ariaDescribedby="dialogBody" disableEscapeKeyClose={true} disableOutsideClickClose={true}>
        <div sx={{
            maxWidth: '640px',
        }}>
          {APP_PACKAGED_IN_EXTENSION ? (<InsideExtensionDialog onPrimaryButtonAction={handleOnStart2FAEnableFlow} onSecondaryButtonAction={handleOnLogout}/>) : (<OutsideExtensionDialog onSecondaryButtonAction={handleOnLogout}/>)}
        </div>
      </Dialog>
    </>);
};
