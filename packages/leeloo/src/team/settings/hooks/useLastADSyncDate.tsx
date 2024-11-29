import { useCallback, useEffect, useState } from "react";
import {
  getLastADSyncDate,
  LastADSyncDateData,
} from "../team-settings-services";
interface UseLastADSyncDate {
  lastADSyncDateLoading: boolean;
  lastADSyncDateError: Error | null;
  lastADSyncDate?: LastADSyncDateData;
}
export function useLastADSyncDate(): UseLastADSyncDate {
  const [lastADSyncDateLoading, setLastADSyncDateLoading] = useState(false);
  const [lastADSyncDateData, setLastADSyncDateData] =
    useState<LastADSyncDateData>();
  const [lastADSyncDateError, setLastADSyncDateError] = useState<Error | null>(
    null
  );
  const loadScimLastSyncDate = useCallback(
    async (abortController: AbortController) => {
      try {
        if (!abortController.signal.aborted) {
          setLastADSyncDateLoading(true);
        }
        const getScimLastSyncDateResult = await getLastADSyncDate();
        if (!abortController.signal.aborted) {
          setLastADSyncDateData(getScimLastSyncDateResult);
          setLastADSyncDateLoading(false);
          setLastADSyncDateError(null);
        }
      } catch (ex) {
        if (!abortController.signal.aborted) {
          setLastADSyncDateLoading(false);
          setLastADSyncDateError(ex);
        }
      }
    },
    []
  );
  useEffect(() => {
    const abortController = new AbortController();
    loadScimLastSyncDate(abortController);
    return () => {
      abortController.abort();
    };
  }, [loadScimLastSyncDate]);
  return {
    lastADSyncDateLoading,
    lastADSyncDate: lastADSyncDateData,
    lastADSyncDateError,
  };
}
