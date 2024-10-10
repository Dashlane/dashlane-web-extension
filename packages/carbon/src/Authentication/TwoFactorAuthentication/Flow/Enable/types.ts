import {
  TwoFactorAuthenticationEnableFlowStageRequest,
  TwoFactorAuthenticationEnableFlowStageResult,
  TwoFactorAuthenticationEnableFlowViewMappers,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { State, StoreService } from "Store";
import { TwoFactorAuthenticationEnableFlowStoreState } from "./Store";
export type StageHandler = (
  coreService: CoreServices,
  data: TwoFactorAuthenticationEnableFlowStoreState,
  flowStageRequest?: TwoFactorAuthenticationEnableFlowStageRequest
) => Promise<TwoFactorAuthenticationEnableFlowStageResult>;
export type StoreMapper = (
  storeService: StoreService
) => TwoFactorAuthenticationEnableFlowStoreState;
export enum TwoFactorAuthenticationBackupPhoneErrorCode {
  INVALID_FORMAT,
  UNKNOWN_ERROR,
}
export type ViewMapper = (
  state: State
) => TwoFactorAuthenticationEnableFlowViewMappers;
