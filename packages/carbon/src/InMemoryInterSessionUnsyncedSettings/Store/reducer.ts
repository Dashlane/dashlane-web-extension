import { combineReducers } from "redux";
import { InMemoryInterSessionUnsyncedState } from "InMemoryInterSessionUnsyncedSettings/Store/types";
import loginNotification from "InMemoryInterSessionUnsyncedSettings/Store/loginNotifications";
export const inMemoryInterSessionUnsyncedSliceReducer =
  combineReducers<InMemoryInterSessionUnsyncedState>({
    loginNotification: loginNotification,
  });
