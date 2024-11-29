export interface ABTest {
  variant: string;
  version?: number;
}
export type ABTests = Record<string, ABTest>;
export interface UserABTests {
  lastUpdateTimestamp?: number;
  tests: ABTests;
}
