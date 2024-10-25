import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { TeamCommands } from "Team/Api/commands";
import { TeamQueries } from "Team/Api/queries";
import { isRecoveryEnabledSelector } from "Team/selectors";
import { getTeamInfo } from "Team/Services/teamSettingsServices";
import { computePlanPricing } from "Team/Services/computePlanPricing";
export const config: CommandQueryBusConfig<TeamCommands, TeamQueries> = {
  commands: {
    getTeamInfo: { handler: getTeamInfo },
    computePlanPricing: {
      handler: computePlanPricing,
    },
  },
  queries: {
    getIsRecoveryEnabled: { selector: isRecoveryEnabledSelector },
  },
  liveQueries: {},
};
