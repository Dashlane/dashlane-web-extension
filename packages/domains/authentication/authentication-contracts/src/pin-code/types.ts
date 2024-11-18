export type PinCodeServerApiEnv = "prod" | "__REDACTED__";
export class PinCodeServerApiConfig {
  public constructor(env: PinCodeServerApiEnv) {
    this.env = env;
  }
  readonly env: PinCodeServerApiEnv;
}
