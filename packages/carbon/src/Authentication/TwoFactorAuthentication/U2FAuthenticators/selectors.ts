import { U2FDevice } from "@dashlane/communication";
import { State } from "Store";
export const listU2FDevicesSelector = (state: State): U2FDevice[] =>
  state.authentication.u2f.u2fDevices;
