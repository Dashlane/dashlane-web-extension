import { WebcardData } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { DismissType } from "@dashlane/hermes";
export interface WebcardPropsBase {
  data: WebcardData;
  closeWebcard: (dismissType?: DismissType) => void;
}
