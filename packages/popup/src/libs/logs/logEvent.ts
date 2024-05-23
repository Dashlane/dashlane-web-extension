import { carbonConnector } from 'src/carbonConnector';
import { BrowseComponent, Event, PageView } from '@dashlane/hermes';
export const logEvent = (event: Event) => carbonConnector.logEvent({ event });
export const logPageView = (pageView: PageView, browseComponent: BrowseComponent = BrowseComponent.ExtensionPopup) => {
    carbonConnector.logPageView({ pageView, browseComponent });
};
