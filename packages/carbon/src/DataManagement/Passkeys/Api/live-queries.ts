import {
  ListResults,
  PasskeyDetailView,
  PasskeyItemView,
} from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type PasskeyLiveQueries = {
  livePasskey: LiveQuery<string, PasskeyDetailView | undefined>;
  livePasskeys: LiveQuery<string, ListResults<PasskeyItemView>>;
};
