import { useEffect, useState } from "react";
import {
  CarbonQueryResult,
  DataStatus,
  useCarbonEndpoint,
} from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../libs/carbon/connector";
import { LoginDeviceLimitFlowView } from "@dashlane/communication";
export function useDeviceLimitInfrastructureProvider(
  flow: CarbonQueryResult<LoginDeviceLimitFlowView | null>
) {
  const [initialFlowState, setInitialFlowState] = useState<
    typeof flow | undefined
  >(undefined);
  useEffect(() => {
    if (flow.status === DataStatus.Success && !initialFlowState) {
      setInitialFlowState(flow);
      if (flow.data) {
        carbonConnector.deviceLimitCapabilityUpdated();
      }
    }
  }, [flow.status, initialFlowState]);
  return initialFlowState;
}
export function useLoginDeviceLimitFlow():
  | LoginDeviceLimitFlowView
  | null
  | undefined {
  const endpointResult = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getLoginDeviceLimitFlow,
      },
      liveConfig: {
        live: carbonConnector.liveLoginDeviceLimitFlow,
      },
    },
    []
  );
  const determinedIfInitialState =
    useDeviceLimitInfrastructureProvider(endpointResult);
  if (
    endpointResult.status !== DataStatus.Success ||
    determinedIfInitialState === undefined
  ) {
    return undefined;
  }
  return endpointResult.data;
}
