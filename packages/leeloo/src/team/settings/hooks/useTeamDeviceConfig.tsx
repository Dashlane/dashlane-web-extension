import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GetTeamDeviceEncryptedConfigFailure,
  GetTeamDeviceEncryptedConfigRequest,
  GetTeamDeviceEncryptedConfigResult,
  GetTeamDeviceEncryptedConfigSuccess,
  UnknownTeamAdminError,
  UpdateTeamDeviceEncryptedConfigFailure,
  UpdateTeamDeviceEncryptedConfigRequest,
  UpdateTeamDeviceEncryptedConfigResult,
} from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
type LoadErrorCode = GetTeamDeviceEncryptedConfigFailure["error"]["code"];
interface UseTeamDeviceConfig {
  teamDeviceConfigLoading: boolean;
  teamDeviceConfig?: GetTeamDeviceEncryptedConfigSuccess["data"] | null;
  loadTeamDeviceConfigErrorCode: LoadErrorCode | null;
  updateTeamDeviceConfig: (
    updateRequest?: UpdateTeamDeviceEncryptedConfigRequest
  ) => Promise<UpdateTeamDeviceEncryptedConfigResult>;
  refreshTeamDeviceConfig: (
    abortControler?: AbortController
  ) => Promise<GetTeamDeviceEncryptedConfigResult>;
}
export const useTeamDeviceConfig = (
  request?: GetTeamDeviceEncryptedConfigRequest
): UseTeamDeviceConfig => {
  const memoizedTeamDeviceConfigRequest: GetTeamDeviceEncryptedConfigRequest =
    useMemo(() => {
      return {
        draft: request?.draft ?? false,
        deviceAccessKey: request?.deviceAccessKey ?? "",
      };
    }, [request?.draft, request?.deviceAccessKey]);
  const [teamDeviceConfigLoading, setTeamDeviceConfigLoading] = useState(true);
  const [loadTeamDeviceConfigErrorCode, setLoadTeamDeviceConfigErrorCode] =
    useState<LoadErrorCode | null>(null);
  const [teamDeviceConfig, setTeamDeviceConfig] = useState<
    GetTeamDeviceEncryptedConfigSuccess["data"] | null
  >(null);
  const loadTeamDeviceConfig = useCallback(async () => {
    try {
      const getTeanDeviceConfigResult: GetTeamDeviceEncryptedConfigResult =
        await carbonConnector.getTeamDeviceEncryptedConfig(
          memoizedTeamDeviceConfigRequest
        );
      return getTeanDeviceConfigResult;
    } catch {
      const failureResult: GetTeamDeviceEncryptedConfigFailure = {
        success: false,
        error: {
          code: UnknownTeamAdminError,
        },
      };
      return failureResult;
    }
  }, [memoizedTeamDeviceConfigRequest]);
  const refreshTeamDeviceConfig = useCallback(
    async (abortController: AbortController = new AbortController()) => {
      if (!abortController.signal.aborted) {
        setTeamDeviceConfigLoading(true);
      }
      const getTeanDeviceConfigResult = await loadTeamDeviceConfig();
      if (!abortController.signal.aborted) {
        setLoadTeamDeviceConfigErrorCode(
          getTeanDeviceConfigResult.success
            ? null
            : getTeanDeviceConfigResult.error.code
        );
        if (getTeanDeviceConfigResult.success) {
          setTeamDeviceConfig(getTeanDeviceConfigResult.data);
        }
        setTeamDeviceConfigLoading(false);
      }
      return getTeanDeviceConfigResult;
    },
    [loadTeamDeviceConfig]
  );
  const updateTeamDeviceConfig = useCallback(
    async (updateRequest: UpdateTeamDeviceEncryptedConfigRequest) => {
      setTeamDeviceConfigLoading(true);
      try {
        const updateResponse: UpdateTeamDeviceEncryptedConfigResult =
          await carbonConnector.updateTeamDeviceEncryptedConfig(updateRequest);
        return updateResponse;
      } catch {
        const failureResult: UpdateTeamDeviceEncryptedConfigFailure = {
          success: false,
          error: { code: UnknownTeamAdminError },
        };
        return failureResult;
      } finally {
        setTeamDeviceConfigLoading(false);
      }
    },
    []
  );
  useEffect(() => {
    const abortController = new AbortController();
    refreshTeamDeviceConfig(abortController);
    return () => {
      abortController.abort();
    };
  }, [refreshTeamDeviceConfig]);
  return {
    teamDeviceConfigLoading,
    loadTeamDeviceConfigErrorCode,
    teamDeviceConfig,
    updateTeamDeviceConfig,
    refreshTeamDeviceConfig,
  };
};
