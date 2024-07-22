export type PinCodeServerApiEnv = "prod" | "*****";
export class PinCodeServerApiConfig {
  public constructor(env: PinCodeServerApiEnv) {
    this.env = env;
  }
  readonly env: PinCodeServerApiEnv;
}
