import { activeSpacesSelector } from "Session/selectors";
import { State } from "Store";
export const isRecoveryEnabledSelector = (state: State): boolean => {
  const activeSpace = activeSpacesSelector(state)[0];
  const isEnabled = activeSpace?.info?.recoveryEnabled ?? false;
  return isEnabled;
};
export const isPersonalSpaceEnabledSelector = (state: State): boolean => {
  const activeSpace = activeSpacesSelector(state)[0];
  return activeSpace?.info?.personalSpaceEnabled ?? true;
};
