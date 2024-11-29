import { useCallback, useEffect, useState } from "react";
import {
  BasicConfig,
  GetEncryptionServiceConfigResult,
  GetEncryptionServiceConfigsFailure,
  UnknownTeamAdminError,
} from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
interface UseEncryptionServiceConfig {
  esConfigLoading: boolean;
  esConfig?: BasicConfig;
  refreshEncryptionServiceConfig: (
    abortController?: AbortController
  ) => Promise<GetEncryptionServiceConfigResult>;
}
export const useEncryptionServiceConfig = (): UseEncryptionServiceConfig => {
  const [esConfigLoading, setESConfigLoading] = useState(false);
  const [basicConfig, setBasicConfig] = useState<BasicConfig>();
  const loadEncryptionServiceConfig = useCallback(async () => {
    try {
      const getESConfigResult: GetEncryptionServiceConfigResult =
        await carbonConnector.getEncryptionServiceConfig();
      return getESConfigResult;
    } catch {
      const failureResult: GetEncryptionServiceConfigsFailure = {
        success: false,
        error: {
          code: UnknownTeamAdminError,
        },
      };
      return failureResult;
    }
  }, []);
  const refreshEncryptionServiceConfig = useCallback(
    async (abortController: AbortController = new AbortController()) => {
      if (!abortController.signal.aborted) {
        setESConfigLoading(true);
      }
      const getEncryptionServiceConfigResult =
        await loadEncryptionServiceConfig();
      if (!abortController.signal.aborted) {
        if (getEncryptionServiceConfigResult.success) {
          setBasicConfig(getEncryptionServiceConfigResult.data);
        }
        setESConfigLoading(false);
      }
      return getEncryptionServiceConfigResult;
    },
    [loadEncryptionServiceConfig]
  );
  useEffect(() => {
    const abortController = new AbortController();
    refreshEncryptionServiceConfig(abortController);
    return () => {
      abortController.abort();
    };
  }, [refreshEncryptionServiceConfig]);
  return {
    esConfigLoading,
    esConfig: basicConfig,
    refreshEncryptionServiceConfig,
  };
};
