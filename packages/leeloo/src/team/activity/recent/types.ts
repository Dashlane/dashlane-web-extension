import { IconProps } from "@dashlane/design-system";
export interface AuditLogView {
  uuid: string;
  userLogin: string;
  category: {
    icon: IconProps["name"];
    label: string;
  };
  activityDescription: string;
  date: Date;
  timestampMs: number;
}
