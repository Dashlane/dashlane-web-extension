import {
  TwoFactorAuthenticationFlowStageRequest,
  TwoFactorAuthenticationFlowStageResult,
} from "@dashlane/communication";
import { State, StoreService } from "Store";
import { CoreServices } from "Services/";
import {
  StageHandler,
  StoreMapper,
} from "Authentication/TwoFactorAuthentication/Flow/Disable/types";
import {
  TwoFactorAuthenticationDisableFlowConfig,
  TwoFactorAuthenticationDisableFlowStages,
} from "Authentication/TwoFactorAuthentication/Flow/Disable/config";
import {
  stopTwoFactorAuthenticationStage,
  TwoFactorAuthenticationDisableFlowStoreState,
  updateTwoFactorAuthenticationStage,
} from "Authentication/TwoFactorAuthentication/Flow/Disable/Store";
const getTwoFactorAuthenticationDisableStage = (state: State) =>
  state.userSession.twoFactorAuthenticationDisableFlow;
type CurrentStageResponse = {
  currentIndex: number;
  currentStage: string;
};
const getCurrentStage = (storeService: StoreService): CurrentStageResponse => {
  const { stage: currentStage } = getTwoFactorAuthenticationDisableStage(
    storeService.getState()
  );
  const currentIndex = TwoFactorAuthenticationDisableFlowStages.findIndex(
    (item) => item.stage === currentStage
  );
  return { currentIndex, currentStage };
};
export const startTwoFactorAuthenticationDisableFlow = ({
  storeService,
}: CoreServices): Promise<TwoFactorAuthenticationFlowStageResult> => {
  const { storeMapper } = TwoFactorAuthenticationDisableFlowConfig.start;
  const data = storeMapper ? storeMapper(storeService) : undefined;
  const action = updateTwoFactorAuthenticationStage({
    ...data,
    stage: TwoFactorAuthenticationDisableFlowStages[0].stage,
  });
  storeService.dispatch(action);
  return Promise.resolve({ success: true });
};
export const stopTwoFactorAuthenticationDisableFlow = (
  coreServices: CoreServices
): Promise<TwoFactorAuthenticationFlowStageResult> => {
  const { storeService } = coreServices;
  storeService.dispatch(stopTwoFactorAuthenticationStage());
  const { currentHandler, storeMapper } =
    TwoFactorAuthenticationDisableFlowConfig.stop;
  const data = storeMapper ? storeMapper(storeService) : undefined;
  if (currentHandler) {
    return currentHandler(coreServices, data);
  }
  return Promise.resolve({ success: true });
};
const handleCurrentStage = (
  coreServices: CoreServices,
  currentHandler: StageHandler,
  storeMapper: StoreMapper,
  flowStageRequest: TwoFactorAuthenticationFlowStageRequest
) => {
  const { storeService } = coreServices;
  const data = storeMapper ? storeMapper(storeService) : undefined;
  return currentHandler(coreServices, data, flowStageRequest);
};
const defaultCurrentHandler = (
  { storeService }: CoreServices,
  data: TwoFactorAuthenticationDisableFlowStoreState
) => {
  const { currentIndex } = getCurrentStage(storeService);
  if (currentIndex !== TwoFactorAuthenticationDisableFlowStages.length - 1) {
    const action = updateTwoFactorAuthenticationStage({
      ...data,
      stage: TwoFactorAuthenticationDisableFlowStages[currentIndex + 1].stage,
    });
    storeService.dispatch(action);
  }
  return Promise.resolve({
    success: true,
  });
};
const defaultBackHandler = (
  { storeService }: CoreServices,
  data: TwoFactorAuthenticationDisableFlowStoreState
) => {
  const { currentIndex } = getCurrentStage(storeService);
  if (currentIndex !== 0) {
    const action = updateTwoFactorAuthenticationStage({
      ...data,
      stage: TwoFactorAuthenticationDisableFlowStages[currentIndex - 1].stage,
    });
    storeService.dispatch(action);
  }
  return Promise.resolve({ success: true });
};
const getStageHandlers = (storeService: StoreService) => {
  const { currentStage } = getCurrentStage(storeService);
  let currentHandler = defaultCurrentHandler;
  let backHandler = defaultBackHandler;
  let storeMapper;
  if (TwoFactorAuthenticationDisableFlowConfig[currentStage]) {
    const handlers = TwoFactorAuthenticationDisableFlowConfig[currentStage];
    backHandler = handlers.backHandler || backHandler;
    currentHandler = handlers.currentHandler || currentHandler;
    storeMapper = handlers.storeMapper;
  }
  return { currentHandler, backHandler, storeMapper };
};
export const continueTwoFactorAuthenticationDisableFlow = (
  coreService: CoreServices,
  flowStageRequest: TwoFactorAuthenticationFlowStageRequest
): Promise<TwoFactorAuthenticationFlowStageResult> => {
  const { storeService } = coreService;
  const { currentHandler, storeMapper } = getStageHandlers(storeService);
  return handleCurrentStage(
    coreService,
    currentHandler,
    storeMapper,
    flowStageRequest
  );
};
export const backTwoFactorAuthenticationDisableFlow = (
  coreService: CoreServices,
  flowStageRequest: TwoFactorAuthenticationFlowStageRequest
): Promise<TwoFactorAuthenticationFlowStageResult> => {
  const { storeService } = coreService;
  const { backHandler, storeMapper } = getStageHandlers(storeService);
  return handleCurrentStage(
    coreService,
    backHandler,
    storeMapper,
    flowStageRequest
  );
};
