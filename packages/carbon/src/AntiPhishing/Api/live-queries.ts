import { LiveQuery } from "Shared/Api";
export type AntiPhishingLiveQueries = {
  livePhishingURLList: LiveQuery<void, Set<string>>;
};
