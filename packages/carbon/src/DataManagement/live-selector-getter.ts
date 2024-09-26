import {
  DataQuery,
  ListResults,
  Mappers,
  Match,
} from "@dashlane/communication";
import { State } from "Store";
import { createSelector } from "reselect";
import { viewListResults } from "DataManagement/Search/views";
import { applyQuery } from "DataManagement/query-selector";
export const makeLiveSelectorGetter =
  <Data, FilterField extends string, SortField extends string, View>(
    selector: (state: State) => Data[],
    viewSelector: (state: State) => (list: Data[]) => View[],
    matcherSelector: (state: State) => Match<Data>,
    mappersSelector: (state: State) => Mappers<Data, SortField, FilterField>
  ) =>
  (
    query: DataQuery<SortField, FilterField>
  ): ((state: State) => ListResults<View>) => {
    const handler = (
      items: Data[],
      mappers: Mappers<Data, SortField, FilterField>,
      matcher: Match<Data>,
      view: (list: Data[]) => View[]
    ): ListResults<View> => {
      const resultsView = viewListResults(view);
      const results = applyQuery(matcher, mappers, query, items);
      return resultsView(results);
    };
    return createSelector(
      selector,
      mappersSelector,
      matcherSelector,
      viewSelector,
      handler
    );
  };
