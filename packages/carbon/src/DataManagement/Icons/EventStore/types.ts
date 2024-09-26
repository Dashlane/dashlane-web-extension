export type IconsBreachUpdatesEvent = {
  breachesIds: string[];
  type: "breachUpdates";
};
export type IconsCredentialUpdatesEvent = {
  credentialIds: string[];
  type: "credentialUpdates";
};
export type IconsRefreshEvent = {
  type: "refresh";
};
export type IconsEvent =
  | IconsBreachUpdatesEvent
  | IconsCredentialUpdatesEvent
  | IconsRefreshEvent;
