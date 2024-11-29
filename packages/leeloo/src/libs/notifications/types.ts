import { AlertSeverity } from "@dashlane/ui-components";
export interface Notification {
  key: string;
  level: AlertSeverity;
  textKey: string;
  isPluralKey?: boolean;
  keyParams?: {
    [key: string]: string | number;
  };
  handleClose: () => void;
  handleLinkClick?: (event: MouseEvent) => void;
  buttonTextKey?: string;
  handleButtonClick?: () => void;
}
export interface State {
  list: Notification[];
}
export default State;
