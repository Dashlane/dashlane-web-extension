import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import {
  ChangeMasterPasswordParams,
  ChangeMasterPasswordProgress,
  ChangeMasterPasswordResponse,
} from "./types";
export const changeMasterPasswordCommandsSlots = {
  changeMasterPassword: slot<
    ChangeMasterPasswordParams,
    ChangeMasterPasswordResponse
  >(),
};
export const changeMasterPasswordLiveQueriesSlots = {
  liveChangeMasterPasswordStatus: liveSlot<ChangeMasterPasswordProgress>(),
};
