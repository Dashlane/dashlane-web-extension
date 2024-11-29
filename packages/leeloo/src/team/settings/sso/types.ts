import { PlanTier, TeamSettings } from "@dashlane/communication";
import { Lee } from "../../../lee";
export enum SSOSettingStep {
  ClaimDomain,
  VerifyDomain,
  SSOConnector,
  EnableSSO,
}
export enum SettingAccordionSections {
  SSOConnector,
  ConfigureIDP,
  EnableSSO,
}
export interface SSOSettingSectionProps {
  setStepComplete: (step: SSOSettingStep) => void;
  uncompleteSteps?: (step: SSOSettingStep[]) => void;
  isTeamSettingsLoading?: boolean;
  error?: string;
  teamSettings?: TeamSettings;
  updateTeamSettings: (settings: TeamSettings) => Promise<void>;
  teamId: number | null;
  planTier: PlanTier | null;
}
export interface SSOSettingProps {
  lee: Lee;
}
export enum DialogAction {
  dismiss,
  action,
}
