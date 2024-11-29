import { Button, IconName } from "@dashlane/design-system";
import { Policies, TeamPolicyUpdates } from "@dashlane/team-admin-contracts";
interface SettingRow {
  type: string;
  label: string;
}
export interface SettingHeader extends SettingRow {
  type: "header";
}
export interface SettingQuickDisable extends SettingRow {
  type: "quickDisable";
  description: string;
  mood: Parameters<typeof Button>[0]["mood"];
  featuresToDisable?: TeamPolicyUpdates;
  icon?: IconName;
  actions?: {
    primary?: {
      label: string;
    };
    secondary?: {
      label: string;
      onClick: () => void;
    };
  };
}
export interface SettingTextWithButton extends SettingRow {
  type: "textwithbutton";
  buttonLabel: string;
  analyticsKey: string;
  onClick: (event: React.SyntheticEvent<HTMLElement>) => void;
  helperLabel?: string;
}
export interface FieldConstraint {
  feature: string;
  condition?: (settings: Policies) => boolean;
  reset?: (policyUpdate: TeamPolicyUpdates) => void;
  warningMessage?: string;
}
interface ConfirmationSetup {
  title: string;
  helper1?: string;
  helper2?: string;
  label: string;
  dismiss: string;
  confirm: string;
}
export interface SettingField extends SettingRow {
  type: "text" | "select" | "switch" | "cta";
  isLoading?: boolean;
  isReadOnly?: boolean;
  badgeLabel?: string;
  badgeIconName?: IconName;
  ctaLabel?: string;
  helperLabel?: React.ReactNode;
  infoBox?: {
    title: string;
    description: React.ReactNode;
    mood?: Parameters<typeof Button>[0]["mood"];
  };
  feature?: string;
  value?: any;
  confirmEnable?: ConfirmationSetup;
  confirmDisable?: ConfirmationSetup;
  getErrorMessageForKey?: (key: string) => string;
  serializer?: (value: any) => any;
  deserializer?: (value: any) => any;
  constraintsFromOtherFields?: {
    disabledWhen?: FieldConstraint[];
    requiredFor?: FieldConstraint[];
  };
  customSwitchHandler?: (value?: boolean) => Promise<void>;
  ctaAction?: () => void;
}
export interface SettingTextField extends SettingField {
  type: "text";
  multiLine?: boolean;
  hintText?: string;
  validator?: (value: string | string[]) => string | undefined | null;
  inputStyle?: React.CSSProperties;
  hintStyle?: React.CSSProperties;
}
export interface SettingSelectField extends SettingField {
  type: "select";
  options: {
    label: string;
    value: string;
    disabled?: boolean;
  }[];
}
export type SettingRowModel =
  | SettingSelectField
  | SettingTextField
  | SettingField
  | SettingHeader
  | SettingQuickDisable
  | SettingTextWithButton;
export interface SettingFieldProps {
  editSettings?: (settings: TeamPolicyUpdates) => Promise<void>;
  checkForAuthenticationError?: () => boolean;
  policies?: Policies;
}
