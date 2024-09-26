import { slot } from "ts-event-bus";
import { ListResults, liveSlot, Page } from "../../CarbonApi";
import {
  GeneratedPasswordFirstTokenParams,
  GeneratedPasswordItemView,
  GeneratedPasswordsDataQuery,
  SaveGeneratedPasswordRequest,
} from "./types";
export const generatedPasswordsQueriesSlots = {
  getGeneratedPassword: slot<string, GeneratedPasswordItemView | undefined>(),
  getGeneratedPasswordsCount: slot<void, number>(),
  getGeneratedPasswords: slot<
    GeneratedPasswordsDataQuery,
    ListResults<GeneratedPasswordItemView>
  >(),
  getGeneratedPasswordsPage: slot<string, Page<GeneratedPasswordItemView>>(),
  getGeneratedPasswordsPaginationToken: slot<
    GeneratedPasswordFirstTokenParams,
    string
  >(),
};
export const generatedPasswordsLiveQueriesSlots = {
  liveGeneratedPasswordsCount: liveSlot<number>(),
  liveGeneratedPasswords: liveSlot<ListResults<GeneratedPasswordItemView>>(),
};
export const generatedPasswordsCommandsSlots = {
  saveGeneratedPassword: slot<SaveGeneratedPasswordRequest, void>(),
};
