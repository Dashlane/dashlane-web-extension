import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { loginStepInfoSelector } from "LoginStepInfo/Store/selectors";
import { liveLoginStepInfo$ } from "LoginStepInfo/live";
import { updateLoginStepInfoHandler } from "LoginStepInfo/handlers/updateLoginStepInfoHandler";
import { resetLoginStepInfoHandler } from "LoginStepInfo/handlers/resetLoginStepInfoHandler";
import { LoginStepInfoCommands } from "LoginStepInfo/Api/commands";
import { LoginStepInfoQueries } from "LoginStepInfo/Api/queries";
import { LoginStepInfoLiveQueries } from "LoginStepInfo/Api/live-queries";
export const config: CommandQueryBusConfig<
  LoginStepInfoCommands,
  LoginStepInfoQueries,
  LoginStepInfoLiveQueries
> = {
  commands: {
    updateLoginStepInfo: { handler: updateLoginStepInfoHandler },
    resetLoginStepInfo: { handler: resetLoginStepInfoHandler },
  },
  queries: {
    getLoginStepInfo: { selector: loginStepInfoSelector },
  },
  liveQueries: {
    liveLoginStepInfo: { operator: liveLoginStepInfo$ },
  },
};
