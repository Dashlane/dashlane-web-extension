import { LiveQuery } from "Shared/Api";
export type ABTestsLiveQueries = {
  liveUserABTestVariant: LiveQuery<string, string | undefined>;
};
