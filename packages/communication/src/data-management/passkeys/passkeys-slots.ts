import { slot } from "ts-event-bus";
import { ListResults, liveSlot } from "../../CarbonApi";
import {
  AddPasskeyRequest,
  AddPasskeyResult,
  DeletePasskeyRequest,
  DeletePasskeyResult,
  PasskeyDataQuery,
  PasskeyDetailView,
  PasskeyItemView,
  PasskeysForDomainDataQuery,
  UpdatePasskeyRequest,
  UpdatePasskeyResult,
} from "./types";
export const passkeyQueriesSlots = {
  getPasskey: slot<string, PasskeyDetailView>(),
  getPasskeys: slot<PasskeyDataQuery, ListResults<PasskeyItemView>>(),
  getPasskeysForDomain: slot<
    PasskeysForDomainDataQuery,
    ListResults<PasskeyItemView>
  >(),
};
export const passkeyLiveQueriesSlots = {
  livePasskey: liveSlot<PasskeyDetailView | undefined>(),
  livePasskeys: liveSlot<ListResults<PasskeyItemView>>(),
};
export const passkeyCommandsSlots = {
  addPasskey: slot<AddPasskeyRequest, AddPasskeyResult>(),
  updatePasskey: slot<UpdatePasskeyRequest, UpdatePasskeyResult>(),
  deletePasskey: slot<DeletePasskeyRequest, DeletePasskeyResult>(),
};
