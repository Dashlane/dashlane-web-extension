import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GetTeamDeviceResult,
  GetTeamDeviceResultFailure,
  TeamDevice,
  UnknownTeamAdminError,
} from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
interface UseTeamDevice {
  teamDeviceLoading: boolean;
  teamDevice?: TeamDevice;
  refreshTeamDevice: (
    abortController?: AbortController
  ) => Promise<GetTeamDeviceResult>;
}
export function useTeamDevice(teamDeviceAccessKey?: string): UseTeamDevice {
  const memoizedTeamDeviceAccessKey = useMemo(
    () => teamDeviceAccessKey,
    [teamDeviceAccessKey]
  );
  const [teamDeviceLoading, setTeamDeviceLoading] = useState(false);
  const [teamDevice, setTeamDevice] = useState<TeamDevice>();
  const loadTeamDevice = useCallback(async () => {
    const failureResult: GetTeamDeviceResultFailure = {
      success: false,
      error: {
        code: UnknownTeamAdminError,
      },
    };
    try {
      if (!memoizedTeamDeviceAccessKey) {
        return failureResult;
      }
      const getTeamDeviceResult: GetTeamDeviceResult =
        await carbonConnector.getTeamDevice({
          teamDeviceAccessKey: memoizedTeamDeviceAccessKey,
        });
      return getTeamDeviceResult;
    } catch {
      return failureResult;
    }
  }, [memoizedTeamDeviceAccessKey]);
  const refreshTeamDevice = useCallback(
    async (abortController: AbortController = new AbortController()) => {
      if (!abortController.signal.aborted) {
        setTeamDeviceLoading(true);
      }
      const getTeamDeviceResult = await loadTeamDevice();
      if (!abortController.signal.aborted) {
        if (getTeamDeviceResult.success) {
          setTeamDevice(getTeamDeviceResult.data.teamDevice);
        }
        setTeamDeviceLoading(false);
      }
      return getTeamDeviceResult;
    },
    [loadTeamDevice]
  );
  useEffect(() => {
    const abortController = new AbortController();
    refreshTeamDevice(abortController);
    return () => {
      abortController.abort();
    };
  }, [refreshTeamDevice]);
  return {
    teamDeviceLoading,
    teamDevice,
    refreshTeamDevice,
  };
}
