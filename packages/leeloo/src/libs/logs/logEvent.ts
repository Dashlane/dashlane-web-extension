import { useEffect, useState } from 'react';
import { Observable, Observer } from 'rxjs';
import { BrowseComponent, Event, PageView } from '@dashlane/hermes';
import { carbonConnector } from 'libs/carbon/connector';
let logPageViewObserver: Observer<PageView>;
export const logEvent = (event: Event) => {
    carbonConnector.logEvent({ event });
};
export const logPageView = (pageView: PageView, browseComponent: BrowseComponent = BrowseComponent.MainApp) => {
    carbonConnector.logPageView({ pageView, browseComponent });
    if (logPageViewObserver) {
        logPageViewObserver.next(pageView);
    }
};
const listenToPageViewUpdates = () => {
    return new Observable<PageView>((observer) => {
        logPageViewObserver = observer;
    });
};
export const useListenToLogPageViews = () => {
    const [currentPageView, setCurrentPageView] = useState('');
    useEffect(() => {
        const logPageViewSubscription = listenToPageViewUpdates().subscribe({
            next: (value) => setCurrentPageView(value),
        });
        return () => logPageViewSubscription.unsubscribe();
    }, []);
    return currentPageView;
};
