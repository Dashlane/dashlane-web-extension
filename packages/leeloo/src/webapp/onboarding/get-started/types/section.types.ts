import { IconProps } from "@dashlane/design-system";
import { GuideItem, Link, Task, TaskStatus } from "./item.types";
import { Action } from "./action.types";
export enum Section {
  VAULT = "vault",
  TEAM_SECURITY = "team-security",
  ADDITIONAL_TASKS = "additional-tasks",
}
export type GuideItemComponentProps = {
  title: string;
  icon: IconProps["name"];
  action?: Action;
  status: TaskStatus;
};
export type GuideSectionItems =
  | Partial<Record<Task, GuideItem>>
  | Partial<Record<Link, GuideItem>>;
export type GuideSection = {
  name: string;
  featureFlips?: string[];
  items: GuideSectionItems;
};
export type GuideSections = Partial<Record<Section, GuideSection>>;
