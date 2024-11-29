import lottie from "lottie-web/build/player/lottie_light";
import loaderAnimation from "../animation-data/loader.json";
import {
  DISPLAY_APP_EVENT_NAME,
  SLOW_BACKGROUND_INIT_EVENT_NAME,
} from "./loader-event";
const MINIUM_DISPLAY_TIME = 1000;
const loaderContainer = document.querySelector(".loaderContainer");
const loadingTarget = document.querySelector(".loaderContainer > .loader");
const slowBackgroundInitContainer = document.getElementById(
  "slow-background-init-warning-container"
);
let didMinimumDisplayTimePassed = false;
let isAppReady = false;
function removeLoader() {
  lottie.destroy();
  if (loaderContainer) {
    loaderContainer.remove();
  }
}
function onAppReady() {
  isAppReady = true;
  if (didMinimumDisplayTimePassed) {
    removeLoader();
  }
}
function onSlowBackgroundInit() {
  if (slowBackgroundInitContainer)
    slowBackgroundInitContainer.style.display = "block";
}
window.addEventListener(DISPLAY_APP_EVENT_NAME, onAppReady, { once: true });
window.addEventListener(SLOW_BACKGROUND_INIT_EVENT_NAME, onSlowBackgroundInit, {
  once: true,
});
const initLoader = () => {
  if (!loadingTarget) {
    throw new Error("Unable to init loader");
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
    animation.removeEventListener("DOMLoaded", onDataReady);
  }
  function onError() {
    removeLoader();
    animation.removeEventListener("error", onError);
  }
  animation.addEventListener("DOMLoaded", onDataReady);
  animation.addEventListener("error", onError);
};
initLoader();
