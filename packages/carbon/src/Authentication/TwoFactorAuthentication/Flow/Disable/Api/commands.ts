import {
  TwoFactorAuthenticationFlowStageRequest,
  TwoFactorAuthenticationFlowStageResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type TwoFactorAuthenticationDisableCommands = {
  startTwoFactorAuthenticationDisableFlow: Command<
    TwoFactorAuthenticationFlowStageRequest,
    TwoFactorAuthenticationFlowStageResult
  >;
  stopTwoFactorAuthenticationDisableFlow: Command<
    TwoFactorAuthenticationFlowStageRequest,
    TwoFactorAuthenticationFlowStageResult
  >;
  continueTwoFactorAuthenticationDisableFlow: Command<
    TwoFactorAuthenticationFlowStageRequest,
    TwoFactorAuthenticationFlowStageResult
  >;
  backTwoFactorAuthenticationDisableFlow: Command<
    TwoFactorAuthenticationFlowStageRequest,
    TwoFactorAuthenticationFlowStageResult
  >;
};
