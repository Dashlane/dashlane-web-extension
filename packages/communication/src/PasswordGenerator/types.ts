export interface PasswordGenerationSettings {
  length: number;
  digits: boolean;
  letters: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
}
export interface GeneratePasswordRequest {
  settings: PasswordGenerationSettings;
}
export interface GenerateAndSavePasswordRequest {
  url: string;
}
export interface GeneratePasswordSuccess {
  success: true;
  password: string;
  strength: number;
}
export interface GeneratePasswordFailure {
  success: false;
}
export type GeneratePasswordResult =
  | GeneratePasswordSuccess
  | GeneratePasswordFailure;
