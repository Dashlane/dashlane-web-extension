import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  DeleteTeamVatError,
  GetTeamVatErrorType,
  teamVatApi,
  UpsertTeamVatError,
} from "@dashlane/team-admin-contracts";
import { Result } from "@dashlane/framework-types";
import { useBillingCountry } from "../helpers/useBillingCountry";
export type UseTeamVatOutput = {
  teamVAT: string;
  upsertTeamVAT?: (
    newVATNumber: Record<"newVATNumber", string>
  ) => Promise<Result<undefined, UpsertTeamVatError>>;
  deleteTeamVAT?: () => Promise<Result<undefined, DeleteTeamVatError>>;
  isLoading: boolean;
  isErrored: boolean;
  isNotApplicable: boolean;
};
export const useTeamVat = (): UseTeamVatOutput => {
  const { loading: isBillingCountryLoading, billingCountry } =
    useBillingCountry();
  const {
    data: queryData,
    status: teamVatQueryStatus,
    error,
  } = useModuleQuery(teamVatApi, "getTeamVat");
  const { deleteTeamVat, upsertTeamVat } = useModuleCommands(teamVatApi);
  const defaultOutput = {
    isLoading: false,
    isErrored: false,
    isNotApplicable: false,
    teamVAT: "",
  };
  if (
    isBillingCountryLoading ||
    teamVatQueryStatus === DataStatus.Loading ||
    !deleteTeamVat ||
    !upsertTeamVat
  ) {
    return { ...defaultOutput, isLoading: true };
  }
  const isVatNotFoundError =
    teamVatQueryStatus === DataStatus.Error &&
    error.tag === GetTeamVatErrorType.VatNumberNotFound;
  if (teamVatQueryStatus === DataStatus.Error && !isVatNotFoundError) {
    return { ...defaultOutput, isErrored: true };
  }
  return billingCountry !== "US"
    ? {
        ...defaultOutput,
        teamVAT: isVatNotFoundError ? "" : queryData ?? "",
        deleteTeamVAT: deleteTeamVat,
        upsertTeamVAT: upsertTeamVat,
      }
    : {
        ...defaultOutput,
        isNotApplicable: true,
      };
};
