import {
  HealthFilter,
  passwordHealthApi,
  PasswordHealthCredentialView,
} from "@dashlane/password-security-contracts";
import { useModuleQuery } from "@dashlane/framework-react";
import { useCallback, useState } from "react";
export interface UseCredentialsFilter {
  filteredCredentials: PasswordHealthCredentialView[];
  hasMore: boolean;
  onNextPage: (pageNumber: number) => void;
  onReset: () => void;
}
const DEFAULT_PAGE_SIZE = 20;
export const useCredentialsFilter = (
  healthFilter: HealthFilter,
  spaceId: string | null
): UseCredentialsFilter => {
  const [pageNumber, setPageNumber] = useState(1);
  const { data } = useModuleQuery(passwordHealthApi, "filterCredentials", {
    healthFilter,
    spaceId,
    pageNumber,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const filteredCredentials = data?.items ?? [];
  const hasMore = filteredCredentials.length < (data?.matchCount ?? 0);
  const onReset = useCallback(() => {
    setPageNumber(1);
  }, [setPageNumber]);
  return {
    filteredCredentials,
    hasMore,
    onNextPage: setPageNumber,
    onReset,
  };
};
