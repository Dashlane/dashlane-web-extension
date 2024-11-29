import React from "react";
import type { Lee } from "../../../lee";
import type { SpaceData } from "../../../libs/carbon/types";
import { getCurrentSpace, getCurrentTeamId } from "../../../libs/carbon/spaces";
import { getCurrentSpaceId } from "../../../libs/webapp";
export const TeamSpaceContext = React.createContext<{
  currentSpaceId: null | string;
  spaceDetails: SpaceData["spaces"][0]["details"] | null;
  teamId: null | number;
}>({
  currentSpaceId: null,
  spaceDetails: null,
  teamId: null,
});
export const TeamSpaceContextProvider = ({
  lee,
  children,
}: React.PropsWithChildren<{
  lee: Lee;
}>) => {
  const currentSpaceId = getCurrentSpaceId(lee.globalState);
  const spaceDetails = getCurrentSpace(lee.globalState)?.details ?? null;
  const teamId = getCurrentTeamId(lee.globalState);
  return (
    <TeamSpaceContext.Provider value={{ teamId, currentSpaceId, spaceDetails }}>
      {children}
    </TeamSpaceContext.Provider>
  );
};
export const useTeamSpaceContext = () => React.useContext(TeamSpaceContext);
