export type ErrorMessages = {
  readonly [code in number]: string;
};
export type ErrorType = {
  readonly codes: {
    [code: number]: string;
  };
  readonly name: string;
  readonly messages: ErrorMessages;
};
export interface LibErrorAdditionalInfo {
  libError?: string;
}
