import React from 'react';
import { jsx } from '@dashlane/ui-components';
import { RateForm } from './content/RateForm';
import { ThankYou } from './content/ThankYou';
import { WebStore } from './content/WebStore';
import { UserMessageTypes } from '@dashlane/communication';
import { useUserMessages } from 'libs/user-messages/useUserMessages';
import { isInChromeExtension } from 'libs/extension';
import { dismissWebStoreMessage } from './utils';
import { RateFormResponse, WebDialogState } from './types';
import { logRateFormResponse } from './logs';
export const WebStoreDialog = () => {
    const [dialogState, setDialogState] = React.useState(WebDialogState.RateForm);
    const messages = useUserMessages();
    const isChrome = isInChromeExtension(window.location.href);
    const hasWebStoreMessage = messages.find((message) => message.type === UserMessageTypes.WEB_STORE && !message.dismissedAt);
    const handleDismiss = () => {
        dismissWebStoreMessage();
    };
    const showDialog = hasWebStoreMessage && isChrome;
    if (showDialog) {
        return (<div sx={{ position: 'absolute', bottom: '40px', right: '40px' }}>
        {dialogState === WebDialogState.RateForm ? (<RateForm onClose={handleDismiss} formResponse={(response: RateFormResponse) => {
                    logRateFormResponse(response);
                    switch (response) {
                        case RateFormResponse.Great:
                            setDialogState(WebDialogState.WebStore);
                            break;
                        case RateFormResponse.Okay:
                        case RateFormResponse.Bad:
                            setDialogState(WebDialogState.ThankYou);
                            break;
                    }
                }}/>) : null}
        {dialogState === WebDialogState.ThankYou ? (<ThankYou onClose={handleDismiss}/>) : null}
        {dialogState === WebDialogState.WebStore ? (<WebStore onClose={handleDismiss}/>) : null}
      </div>);
    }
    return null;
};
