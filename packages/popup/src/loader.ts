import { iframe } from "@dashlane/browser-utils";
import { PerformanceMarker, performanceMethods } from "./libs/performance";
import { launchPopup } from "./index";
performanceMethods.mark(PerformanceMarker.POPUP_LAUNCH);
let appLoaded = false;
function displayLoader() {
  const skeletonLoader = document.getElementById("skeleton-loader");
  skeletonLoader?.classList.remove("hidden");
}
function displayApp() {
  if (!appLoaded) {
    return;
  }
  const skeletonLoader = document.getElementById("skeleton-loader");
  const app = document.getElementById("app");
  const loaderContainer = document.getElementById("loader-container");
  if (!app || !skeletonLoader || !loaderContainer) {
    return;
  }
  skeletonLoader.classList.add("hidden");
  loaderContainer.classList.add("hidden");
  loaderContainer.setAttribute("aria-busy", "false");
  app.classList.remove("hidden");
  performanceMethods.measure(
    "Showing native HTML loading state",
    PerformanceMarker.POPUP_LAUNCH
  );
  performanceMethods.saveMeasurements();
}
function loadPopup() {
  performanceMethods.measure(
    "Artificially waiting for loader to render",
    PerformanceMarker.POPUP_LAUNCH
  );
  void launchPopup();
  performanceMethods.mark(PerformanceMarker.BUNDLE_AVAILABLE);
}
function start() {
  window.addEventListener(
    "display-app",
    () => {
      appLoaded = true;
      displayApp();
    },
    { once: true }
  );
  window.addEventListener(
    "load",
    () => {
      setTimeout(() => {
        loadPopup();
      }, 100);
    },
    { once: true }
  );
  void displayLoader();
}
if (iframe.isInsideIframe()) {
  throw new Error("Popup should not be run in an iframe");
} else {
  start();
}
