import {
  TwoFactorAuthenticationEnableFlowStageRequest,
  TwoFactorAuthenticationEnableFlowStageResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type TwoFactorAuthenticationEnableCommands = {
  startTwoFactorAuthenticationEnableFlow: Command<
    TwoFactorAuthenticationEnableFlowStageRequest,
    TwoFactorAuthenticationEnableFlowStageResult
  >;
  stopTwoFactorAuthenticationEnableFlow: Command<
    TwoFactorAuthenticationEnableFlowStageRequest,
    TwoFactorAuthenticationEnableFlowStageResult
  >;
  continueTwoFactorAuthenticationEnableFlow: Command<
    TwoFactorAuthenticationEnableFlowStageRequest,
    TwoFactorAuthenticationEnableFlowStageResult
  >;
  backTwoFactorAuthenticationEnableFlow: Command<
    TwoFactorAuthenticationEnableFlowStageRequest,
    TwoFactorAuthenticationEnableFlowStageResult
  >;
};
