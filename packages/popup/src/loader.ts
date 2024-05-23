import { iframe } from '@dashlane/browser-utils';
import { PerformanceMarker, performanceMethods } from 'libs/performance';
import { carbonConnector } from './carbonConnector/loader';
import { launchPopup } from './index';
performanceMethods.mark(PerformanceMarker.POPUP_LAUNCH);
let appLoaded = false;
async function chooseLoader() {
    const isAuthenticated = await carbonConnector.getIsAuthenticated();
    if (isAuthenticated) {
        const skeletonLoader = document.getElementById('skeleton-loader');
        skeletonLoader?.classList.remove('hidden');
    }
    else {
        const loginLoader = document.getElementById('login-loader');
        loginLoader?.classList.remove('hidden');
    }
}
function displayApp() {
    if (!appLoaded) {
        return;
    }
    const skeletonLoader = document.getElementById('skeleton-loader');
    const loginLoader = document.getElementById('login-loader');
    const app = document.getElementById('app');
    const loaderContainer = document.getElementById('loader-container');
    if (!app || !skeletonLoader || !loaderContainer || !loginLoader) {
        return;
    }
    skeletonLoader.classList.add('hidden');
    loginLoader.classList.add('hidden');
    loaderContainer.classList.add('hidden');
    loaderContainer.setAttribute('aria-busy', 'false');
    app.classList.remove('hidden');
    performanceMethods.measure('Showing native HTML loading state', PerformanceMarker.POPUP_LAUNCH);
    performanceMethods.saveMeasurements();
}
function loadPopup() {
    performanceMethods.measure('Artificially waiting for loader to render', PerformanceMarker.POPUP_LAUNCH);
    void launchPopup();
    performanceMethods.mark(PerformanceMarker.BUNDLE_AVAILABLE);
}
function start() {
    window.addEventListener('display-app', () => {
        appLoaded = true;
        displayApp();
    }, { once: true });
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadPopup();
        }, 100);
    }, { once: true });
    void chooseLoader();
}
if (iframe.isInsideIframe()) {
    throw new Error('Popup should not be run in an iframe');
}
else {
    start();
}
