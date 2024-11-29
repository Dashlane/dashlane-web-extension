import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  GetTaxAmountQueryResult,
  teamVatApi,
} from "@dashlane/team-admin-contracts";
interface UseTaxInformationProps {
  total: number;
  onError?: () => void;
  initialSkip?: boolean;
}
interface UseTaxInformationOutput {
  isLoading: boolean;
  taxInformation: GetTaxAmountQueryResult | undefined;
}
export function useTaxInformation({
  total,
  onError,
  initialSkip,
}: UseTaxInformationProps): UseTaxInformationOutput {
  const [isLoading, setIsLoading] = useState(false);
  const [taxInformation, setTaxInformation] =
    useState<GetTaxAmountQueryResult>();
  const [cache, setCache] = useState<Record<number, GetTaxAmountQueryResult>>(
    {}
  );
  const [debouncedTotal, setDebouncedTotal] = useState(total);
  const previousTotal = useRef(total);
  const debouncedSetTotal = useCallback(
    debounce((value: number) => {
      setDebouncedTotal(value);
    }, 500),
    []
  );
  useEffect(() => {
    if (cache[total]) {
      setTaxInformation(cache[total]);
      return;
    }
    if (total !== previousTotal.current) {
      previousTotal.current = total;
      debouncedSetTotal(total);
    }
  }, [total, cache, debouncedSetTotal]);
  const getTaxInformation = useModuleQuery(
    teamVatApi,
    "getTaxAmount",
    {
      totalPrice: debouncedTotal,
    },
    {
      initialSkip: initialSkip ?? !!cache[debouncedTotal],
    }
  );
  useEffect(() => {
    if (getTaxInformation.status === DataStatus.Loading) {
      setIsLoading(true);
    } else if (
      getTaxInformation.status === DataStatus.Success &&
      getTaxInformation.data
    ) {
      setIsLoading(false);
      const newTaxInfo = { amount: getTaxInformation.data.amount };
      setTaxInformation(newTaxInfo);
      setCache((prev) => ({
        ...prev,
        [debouncedTotal]: newTaxInfo,
      }));
    } else if (getTaxInformation.status === DataStatus.Error) {
      onError?.();
      setIsLoading(false);
      setTaxInformation(undefined);
    }
  }, [
    getTaxInformation.status,
    getTaxInformation.data,
    onError,
    debouncedTotal,
  ]);
  useEffect(() => {
    return () => {
      debouncedSetTotal.cancel();
    };
  }, [debouncedSetTotal]);
  return { isLoading, taxInformation };
}
