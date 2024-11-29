import { WebcardData } from "@dashlane/autofill-engine/types";
import { DismissType } from "@dashlane/hermes";
export interface WebcardPropsBase {
  data: WebcardData;
  closeWebcard: (dismissType?: DismissType) => void;
}
