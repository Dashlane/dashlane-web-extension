import { InitMode } from "Sdk/Default/types";
export interface TeamSpaceContentControlDone {
  deletedItemIds: string[];
  hiddenItemIds: string[];
  updatedItemIds: string[];
}
export interface SessionOpened {
  login: string;
}
export interface SessionClosed {
  login: string;
}
export interface AppInitialized {
  initMode: InitMode;
  abTestForcedVersion?: string;
}
export interface CoreServicesReady {
  initMode: InitMode;
}
