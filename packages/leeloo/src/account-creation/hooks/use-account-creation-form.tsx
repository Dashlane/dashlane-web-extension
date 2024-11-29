import { accountCreationApi } from "@dashlane/account-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import { getSignUpUrlQueryParameters } from "../helpers";
import { useLocation } from "../../libs/router";
export function useAccountCreationForm() {
  const { search } = useLocation();
  const {
    emailQueryParam,
    prefilledTeamKey,
    isFromMassDeployment,
    withNewFlowQueryParam,
    withSkipButtonQueryParam,
  } = getSignUpUrlQueryParameters(search);
  const { createPasswordlessAccount } = useModuleCommands(accountCreationApi);
  return {
    emailQueryParam,
    prefilledTeamKey,
    isFromMassDeployment,
    createPasswordlessAccount,
    withNewFlowQueryParam,
    withSkipButtonQueryParam,
  };
}
