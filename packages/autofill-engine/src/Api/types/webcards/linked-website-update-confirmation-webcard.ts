import { WebcardDataBase, WebcardType } from "./webcard-data-base";
interface LinkedWebsiteOperationType {
  readonly credentialId: string;
  readonly credentialName: string;
  readonly linkedWebsite: string;
}
export interface LinkedWebsiteUpdateConfirmationData extends WebcardDataBase {
  readonly webcardType: WebcardType.LinkedWebsiteUpdateConfirmation;
  readonly operation: LinkedWebsiteOperationType;
}
