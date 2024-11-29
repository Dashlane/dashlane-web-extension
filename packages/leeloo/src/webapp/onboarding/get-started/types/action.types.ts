import { ButtonProps, IconProps } from "@dashlane/design-system";
import { ActionType } from "./item.types";
type BaseAction = {
  label: string;
  handler: () => void;
};
export type TaskAction = BaseAction & {
  type: ActionType.TASK;
  layout?: ButtonProps["layout"];
  icon?: IconProps["name"];
};
export type LinkAction = BaseAction & {
  type: ActionType.LINK;
  href: string;
};
export type Action = LinkAction | TaskAction;
