import {
  TwoFactorAuthenticationDisableFlowViewMappers,
  TwoFactorAuthenticationFlowStageRequest,
  TwoFactorAuthenticationFlowStageResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { State, StoreService } from "Store";
import { TwoFactorAuthenticationDisableFlowStoreState } from "./Store";
export type StageHandler = (
  coreService: CoreServices,
  data: TwoFactorAuthenticationDisableFlowStoreState,
  flowStageRequest?: TwoFactorAuthenticationFlowStageRequest
) => Promise<TwoFactorAuthenticationFlowStageResult>;
export type StoreMapper = (
  storeService: StoreService
) => TwoFactorAuthenticationDisableFlowStoreState;
export type ViewMapper = (
  state: State
) => TwoFactorAuthenticationDisableFlowViewMappers;
