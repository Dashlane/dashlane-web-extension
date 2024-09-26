import { State } from "Store";
import { activeSpacesSelector } from "Session/selectors";
export const isForcedDomainsEnabledSelector = (state: State): boolean => {
  const activeSpace = activeSpacesSelector(state)[0];
  return activeSpace?.info?.forcedDomainsEnabled ?? false;
};
