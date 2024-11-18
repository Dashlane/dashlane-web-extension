import { useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import {
  BreachesFilterField,
  BreachesQuery,
  BreachStatus,
  FilterCriterium,
} from "@dashlane/communication";
import { carbonConnector } from "../../../carbonConnector";
export const useBreaches = (breachStatus: BreachStatus) => {
  const filterCriteria: FilterCriterium<BreachesFilterField>[] = [
    {
      field: "status",
      type: "equals",
      value: breachStatus,
    },
    {
      field: "breachType",
      type: "equals",
      value: "private",
    },
  ];
  const queryParam: BreachesQuery = {
    filterToken: { filterCriteria },
    sortToken: { sortCriteria: [], uniqField: "id" },
  };
  const liveParam = btoa(JSON.stringify(queryParam));
  return useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getBreaches,
        queryParam,
      },
      liveConfig: {
        live: carbonConnector.liveBreaches,
        liveParam,
      },
    },
    [breachStatus]
  );
};
