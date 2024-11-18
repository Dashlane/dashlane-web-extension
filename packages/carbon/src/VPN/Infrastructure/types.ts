interface VpnCredentialGenerationSuccess {
  success: true;
  password: string;
}
interface VpnCredentialGenerationError {
  success: false;
  error: VpnErrorType;
}
export type VpnCredentialGenerationResult =
  | VpnCredentialGenerationSuccess
  | VpnCredentialGenerationError;
export interface VpnCredentialGenerator {
  generateCredential: (
    login: string,
    email: string
  ) => Promise<VpnCredentialGenerationResult>;
}
export enum VpnErrorType {
  AccountAlreadyExistError = "AccountAlreadyExist",
  ServerError = "ServerError",
}
export interface VpnLogger {
  logStart: () => Promise<void>;
  logComplete: () => Promise<void>;
  logError: (errorType: VpnErrorType) => Promise<void>;
}
export interface VpnInfrastructure {
  generator: VpnCredentialGenerator;
  logger: VpnLogger;
}
