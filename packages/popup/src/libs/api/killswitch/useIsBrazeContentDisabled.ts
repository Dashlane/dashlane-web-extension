import { useModuleQuery } from "@dashlane/framework-react";
import { killSwitchApi, KillSwitches } from "@dashlane/framework-contracts";
export const useIsBrazeContentDisabled = () => {
  const killSwitchData = useModuleQuery(killSwitchApi, "getKillSwitch", {
    killSwitch: KillSwitches.BrazeContentCardsDisabled,
  });
  return killSwitchData;
};
