import { PerformanceMarker, performanceMethods } from 'libs/performance';
performanceMethods.mark(PerformanceMarker.BUNDLE_LOADED);
performanceMethods.measure('Loading React Bundle', PerformanceMarker.BUNDLE_AVAILABLE);
import * as React from 'react';
import { render } from 'react-dom';
import 'what-input';
import { AppContainer } from 'container';
import workaroundCustomProtocolLinks from 'src/workaroundCustomProtocolLinks';
import { openWebAppAndClosePopup } from 'src/app/helpers';
import { initPopup } from 'src/initPopup';
import { carbonConnector } from 'src/carbonConnector';
import './styles/reset.css';
import './styles/index.css';
export async function launchPopup() {
    const { kernel } = await initPopup();
    performanceMethods.measure('initialising the popup', PerformanceMarker.BUNDLE_LOADED);
    performanceMethods.mark(PerformanceMarker.POPUP_INITIALISED);
    render(<AppContainer kernel={kernel}/>, document.getElementById('app'));
    workaroundCustomProtocolLinks(window, 'dashlane:');
    if (!APP_PACKAGED_FOR_FIREFOX) {
        return;
    }
    const [{ localAccounts = [] }, consentSettings] = await Promise.all([
        carbonConnector.getLocalAccountsList(null),
        carbonConnector.getGlobalExtensionSettings(),
    ]);
    const needsConsent = localAccounts.length === 0 && consentSettings.personalDataConsent !== true;
    if (needsConsent) {
        await openWebAppAndClosePopup({ route: '/signup' });
    }
    else if (!consentSettings.personalDataConsent) {
        await carbonConnector.setGlobalExtensionSettings({
            interactionDataConsent: true,
            personalDataConsent: true,
        });
    }
}
