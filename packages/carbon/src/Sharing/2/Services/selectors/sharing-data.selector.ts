import { State } from "Store";
import { SharingData } from "Session/Store/sharingData/types";
export const sharingDataSelector = (state: State): SharingData =>
  state.userSession.sharingData;
