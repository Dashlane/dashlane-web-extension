import { Enum } from "typescript-string-enums";
export const ExtensionDebugEventType = Enum(
  "GET_EXTENSION_ID",
  "SIGNAL_TTI",
  "DATABASES_SEND",
  "SHOW_INPUT",
  "SHOW_FORM_ON_PAGE",
  "SWITCH_TO_STANDALONE"
);
export type ExtensionDebugEventType = Enum<typeof ExtensionDebugEventType>;
export interface IOrderToExtension {
  action: string;
  tabId: number;
}
export interface ShowInputData extends IOrderToExtension {
  data: {
    DOMType: string;
    HashId: string;
    SimulateClick: boolean;
  };
}
export interface ShowFormsData extends IOrderToExtension {
  data: {
    Parent: {
      HashId: string;
    };
    SpatialInfos: {
      positionX: number;
      positionY: number;
    };
    Type: string;
  };
}
