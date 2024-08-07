import { WebauthnGetRequest } from "../webauthn";
import { WebcardDataBase, WebcardType } from "./webcard-data-base";
export interface WebauthnGetConfirmationWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.WebauthnGetConfirmation;
  readonly request: WebauthnGetRequest;
  readonly passkey: {
    readonly passkeyItemId: string;
    readonly userDisplayName: string;
  };
  readonly rpName: string;
  readonly allowUsingOtherAuthenticator: boolean;
}
