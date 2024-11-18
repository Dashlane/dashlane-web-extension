import {
  alarmsCreate,
  alarmsGet,
  alarmsIsSupported,
  alarmsOnAlarm,
} from "@dashlane/webextensions-apis";
import { StoreService } from "Store";
import { updateKillswitchState } from "Killswitch/killswitchUpdate";
let syncKillswitchTimer: ReturnType<typeof setTimeout> | null = null;
const syncKillswitchTimeIntervalInMin = 60;
const syncKillswitchTimeIntervalInMs =
  syncKillswitchTimeIntervalInMin * 60 * 1000;
const ALARM_NAME = "killswitch-alarm";
async function startSyncKillswitchTimerWithAlarm(storeService: StoreService) {
  const alarmAlreadyExists = await alarmsGet(ALARM_NAME);
  if (!alarmAlreadyExists) {
    updateKillswitchState(storeService);
    alarmsCreate(ALARM_NAME, {
      periodInMinutes: syncKillswitchTimeIntervalInMin,
    });
  }
  const listener = (alarm: chrome.alarms.Alarm) => {
    if (alarm.name === ALARM_NAME) {
      updateKillswitchState(storeService);
    }
  };
  alarmsOnAlarm.addListener(listener);
}
function startSyncKillswitchTimerFallback(storeService: StoreService) {
  if (!syncKillswitchTimer) {
    updateKillswitchState(storeService);
    syncKillswitchTimer = setInterval(() => {
      try {
        updateKillswitchState(storeService);
      } catch {}
    }, syncKillswitchTimeIntervalInMs);
  }
  return syncKillswitchTimer;
}
export function triggerKillswitchCron(storeService: StoreService) {
  if (alarmsIsSupported()) {
    startSyncKillswitchTimerWithAlarm(storeService);
  } else {
    startSyncKillswitchTimerFallback(storeService);
  }
}
