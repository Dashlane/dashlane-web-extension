import { SLOW_BACKGROUND_INIT_EVENT_NAME } from "../../loader/loader-event";
import { checkPromiseState } from "./check-promise-state";
export async function checkBackgroundStatus() {
  const LOADING_TIMEOUT = 10000;
  try {
    const backgroundReadyPromise = navigator.serviceWorker.ready;
    const result = await checkPromiseState(
      backgroundReadyPromise,
      LOADING_TIMEOUT
    );
    if (result === "pending") {
      window.dispatchEvent(new Event(SLOW_BACKGROUND_INIT_EVENT_NAME));
    }
  } catch (error) {
    console.error("[leeloo] Service worker promise rejected");
    throw new Error("Service worker promise rejected", { cause: error });
  }
}
