import {
  TwoFactorAuthenticationEnableFlowStageRequest,
  TwoFactorAuthenticationEnableFlowStageResult,
} from "@dashlane/communication";
import { State, StoreService } from "Store";
import { CoreServices } from "Services/";
import {
  StageHandler,
  StoreMapper,
} from "Authentication/TwoFactorAuthentication/Flow/Enable/types";
import {
  TwoFactorAuthenticationEnableFlowConfig,
  TwoFactorAuthenticationEnableFlowStages,
} from "Authentication/TwoFactorAuthentication/Flow/Enable/config";
import {
  stopTwoFactorAuthenticationStage,
  TwoFactorAuthenticationEnableFlowStoreState,
  updateTwoFactorAuthenticationStage,
} from "Authentication/TwoFactorAuthentication/Flow/Enable/Store";
const getTwoFactorAuthenticationEnableStage = (state: State) =>
  state.userSession.twoFactorAuthenticationEnableFlow;
type CurrentStageResponse = {
  currentIndex: number;
  currentStage: string;
};
const getCurrentStage = (storeService: StoreService): CurrentStageResponse => {
  const { stage: currentStage } = getTwoFactorAuthenticationEnableStage(
    storeService.getState()
  );
  const currentIndex = TwoFactorAuthenticationEnableFlowStages.findIndex(
    (item) => item.stage === currentStage
  );
  return { currentIndex, currentStage };
};
const clearStageData = (storeService: StoreService) => {
  const data = getTwoFactorAuthenticationEnableStage(storeService.getState());
  const action = updateTwoFactorAuthenticationStage({
    ...data,
    stageData: undefined,
  });
  storeService.dispatch(action);
};
export const startTwoFactorAuthenticationEnableFlow = ({
  storeService,
}: CoreServices): Promise<TwoFactorAuthenticationEnableFlowStageResult> => {
  const { storeMapper } = TwoFactorAuthenticationEnableFlowConfig.start;
  const data = storeMapper ? storeMapper(storeService) : undefined;
  const action = updateTwoFactorAuthenticationStage({
    ...data,
    stage: TwoFactorAuthenticationEnableFlowStages[0].stage,
  });
  storeService.dispatch(action);
  return Promise.resolve({ success: true });
};
export const stopTwoFactorAuthenticationEnableFlow = (
  coreServices: CoreServices
): Promise<TwoFactorAuthenticationEnableFlowStageResult> => {
  const { storeService } = coreServices;
  storeService.dispatch(stopTwoFactorAuthenticationStage());
  const { currentHandler, storeMapper } =
    TwoFactorAuthenticationEnableFlowConfig.stop;
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
  flowStageRequest: TwoFactorAuthenticationEnableFlowStageRequest
) => {
  const { storeService } = coreServices;
  const data = storeMapper ? storeMapper(storeService) : undefined;
  return currentHandler(coreServices, data, flowStageRequest);
};
const defaultCurrentHandler = (
  { storeService }: CoreServices,
  data: TwoFactorAuthenticationEnableFlowStoreState
) => {
  const { currentIndex } = getCurrentStage(storeService);
  if (currentIndex !== TwoFactorAuthenticationEnableFlowStages.length - 1) {
    const action = updateTwoFactorAuthenticationStage({
      ...data,
      stage: TwoFactorAuthenticationEnableFlowStages[currentIndex + 1].stage,
    });
    storeService.dispatch(action);
  }
  return Promise.resolve({
    success: true,
  });
};
const defaultBackHandler = (
  { storeService }: CoreServices,
  data: TwoFactorAuthenticationEnableFlowStoreState
) => {
  const { currentIndex } = getCurrentStage(storeService);
  if (currentIndex !== 0) {
    const action = updateTwoFactorAuthenticationStage({
      ...data,
      stage: TwoFactorAuthenticationEnableFlowStages[currentIndex - 1].stage,
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
  if (TwoFactorAuthenticationEnableFlowConfig[currentStage]) {
    const handlers = TwoFactorAuthenticationEnableFlowConfig[currentStage];
    backHandler = handlers.backHandler || backHandler;
    currentHandler = handlers.currentHandler || currentHandler;
    storeMapper = handlers.storeMapper;
  }
  return { currentHandler, backHandler, storeMapper };
};
export const continueTwoFactorAuthenticationEnableFlow = (
  coreService: CoreServices,
  flowStageRequest: TwoFactorAuthenticationEnableFlowStageRequest
): Promise<TwoFactorAuthenticationEnableFlowStageResult> => {
  const { storeService } = coreService;
  const { currentHandler, storeMapper } = getStageHandlers(storeService);
  return handleCurrentStage(
    coreService,
    currentHandler,
    storeMapper,
    flowStageRequest
  );
};
export const backTwoFactorAuthenticationEnableFlow = (
  coreService: CoreServices,
  flowStageRequest: TwoFactorAuthenticationEnableFlowStageRequest
): Promise<TwoFactorAuthenticationEnableFlowStageResult> => {
  const { storeService } = coreService;
  const { backHandler, storeMapper } = getStageHandlers(storeService);
  clearStageData(storeService);
  return handleCurrentStage(
    coreService,
    backHandler,
    storeMapper,
    flowStageRequest
  );
};
