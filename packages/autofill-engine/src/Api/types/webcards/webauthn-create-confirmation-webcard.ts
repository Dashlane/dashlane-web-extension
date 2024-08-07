import { WebauthnCreationRequest } from "../webauthn";
import { WebcardDataBase, WebcardType } from "./webcard-data-base";
export interface WebauthnCreateConfirmationWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.WebauthnCreateConfirmation;
  readonly request: WebauthnCreationRequest;
  readonly userDisplayName: string;
  readonly rpName: string;
}
