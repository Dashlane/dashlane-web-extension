import { getCommonAppSetting } from "Application/ApplicationSettings";
export const anonymousComputerIdSelector = (): string => {
  return getCommonAppSetting("anonymousComputerId");
};
