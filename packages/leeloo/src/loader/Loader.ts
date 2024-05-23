import lottie from 'lottie-web/build/player/lottie_light';
import loaderAnimation from '../animation-data/loader.json';
const MINIUM_DISPLAY_TIME = 1000;
const DISPLAY_APP_EVENT_NAME = 'display-app';
const containerTarget = document.querySelector('.loaderContainer');
const loadingTarget = document.querySelector('.loader');
let didMinimumDisplayTimePassed = false;
let isAppReady = false;
function removeLoader() {
    lottie.destroy();
    if (containerTarget) {
        containerTarget.remove();
    }
}
function onAppReady() {
    isAppReady = true;
    if (didMinimumDisplayTimePassed) {
        removeLoader();
    }
    window.removeEventListener(DISPLAY_APP_EVENT_NAME, onAppReady);
}
window.addEventListener(DISPLAY_APP_EVENT_NAME, onAppReady);
const initLoader = () => {
    if (!loadingTarget) {
        throw new Error('Unable to init loader');
    }
    const animation = lottie.loadAnimation({
        container: loadingTarget,
        loop: true,
        autoplay: true,
        animationData: loaderAnimation,
        rendererSettings: {
            progressiveLoad: false,
        },
    });
    function onDataReady() {
        setTimeout(() => {
            didMinimumDisplayTimePassed = true;
            if (isAppReady) {
                removeLoader();
            }
        }, MINIUM_DISPLAY_TIME);
        animation.removeEventListener('DOMLoaded', onDataReady);
    }
    function onError() {
        removeLoader();
        animation.removeEventListener('error', onError);
    }
    animation.addEventListener('DOMLoaded', onDataReady);
    animation.addEventListener('error', onError);
};
initLoader();
