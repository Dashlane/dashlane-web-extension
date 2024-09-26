import {
  ListResults,
  PasskeyDataQuery,
  PasskeyDetailView,
  PasskeyItemView,
  PasskeysForDomainDataQuery,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type PasskeyQueries = {
  getPasskey: Query<string, PasskeyDetailView>;
  getPasskeys: Query<PasskeyDataQuery, ListResults<PasskeyItemView>>;
  getPasskeysForDomain: Query<
    PasskeysForDomainDataQuery,
    ListResults<PasskeyItemView>
  >;
};
