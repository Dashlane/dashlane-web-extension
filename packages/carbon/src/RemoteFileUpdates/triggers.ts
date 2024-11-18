import {
  alarmsCreate,
  alarmsGet,
  alarmsIsSupported,
  alarmsOnAlarm,
} from "@dashlane/webextensions-apis";
import { CoreServices } from "Services";
import { downloadRemoteFileHandler } from "RemoteFileUpdates/handlers/downloadRemoteFileHandler";
import { FILE_SETTINGS } from "./constants";
import { loadFilesAtInit } from "./handlers/loadFileAtInit";
const REMOTE_FILE_UPDATE_TIME_INTERVAL_MIN = 30;
const REMOTE_FILE_UPDATE_TIME_INTERVAL_MS =
  REMOTE_FILE_UPDATE_TIME_INTERVAL_MIN * 60 * 1000;
const ALARM_NAME = "carbon-rfu-alarm";
function callRemoteFileUpdateHandler(coreServices: CoreServices) {
  return downloadRemoteFileHandler(coreServices, FILE_SETTINGS);
}
export function triggerLoadFileAtInit(coreService: CoreServices): void {
  return loadFilesAtInit(coreService);
}
let isRFUAlarmListenerAdded = false;
async function startRemoteFileUpdateAlarm(coreServices: CoreServices) {
  const alarmAlreadyExists = await alarmsGet(ALARM_NAME);
  if (!isRFUAlarmListenerAdded) {
    alarmsOnAlarm.addListener((alarm: chrome.alarms.Alarm) => {
      if (alarm.name === ALARM_NAME) {
        callRemoteFileUpdateHandler(coreServices);
      }
    });
    isRFUAlarmListenerAdded = true;
  }
  if (alarmAlreadyExists) {
    return;
  }
  alarmsCreate(ALARM_NAME, {
    delayInMinutes: 1,
    periodInMinutes: REMOTE_FILE_UPDATE_TIME_INTERVAL_MIN,
  });
}
function startRemoteFileUpdateInterval(coreServices: CoreServices) {
  callRemoteFileUpdateHandler(coreServices);
  return setInterval(() => {
    callRemoteFileUpdateHandler(coreServices);
  }, REMOTE_FILE_UPDATE_TIME_INTERVAL_MS);
}
function stopRemoteFileUpdateInterval(
  remoteFileUpdateInterval: NodeJS.Timeout
) {
  clearInterval(remoteFileUpdateInterval);
}
let remoteFileUpdateInterval: NodeJS.Timeout | null = null;
export function triggerDownloadRemoteFileUpdate(
  coreServices: CoreServices,
  justLoggedIn: boolean
) {
  if (remoteFileUpdateInterval) {
    stopRemoteFileUpdateInterval(remoteFileUpdateInterval);
  }
  if (justLoggedIn) {
    if (alarmsIsSupported()) {
      startRemoteFileUpdateAlarm(coreServices);
      return;
    }
    remoteFileUpdateInterval = startRemoteFileUpdateInterval(coreServices);
  }
}
