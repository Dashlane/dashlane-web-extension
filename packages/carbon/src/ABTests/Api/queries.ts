import { Query } from "Shared/Api";
export type ABTestsQueries = {
  getUserABTestVariant: Query<string, string | undefined>;
};
