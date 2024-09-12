export abstract class AppLogger {
  abstract log(message: unknown, ...optionalParams: unknown[]): void;
  abstract error(message: unknown, ...optionalParams: unknown[]): void;
  abstract warn(message: unknown, ...optionalParams: unknown[]): void;
  abstract trace(message: unknown, ...optionalParams: unknown[]): void;
}
export class NullLogger extends AppLogger {
  log(): void {}
  error(): void {}
  warn(): void {}
  trace(): void {}
}
