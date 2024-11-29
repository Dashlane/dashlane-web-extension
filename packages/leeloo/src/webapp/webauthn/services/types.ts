import { WebAuthnCallType } from "@dashlane/communication";
export interface EnableWebAuthnAuthenticationSuccess {
  success: true;
  data: {
    isRoaming?: boolean;
    authenticationType: WebAuthnCallType;
  };
}
export interface EnableWebAuthnAuthenticationFailure {
  success: false;
}
export declare type EnableWebAuthnAuthenticationResult =
  | EnableWebAuthnAuthenticationSuccess
  | EnableWebAuthnAuthenticationFailure;
