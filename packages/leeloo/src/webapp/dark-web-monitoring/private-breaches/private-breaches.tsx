import * as React from "react";
import {
  BreachesFilterCriterium,
  BreachesFirstTokenParams,
  BreachesSortCriterium,
  BreachItemView,
  BreachStatus,
} from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
import {
  connectPagination,
  PaginationConfig,
} from "../../../libs/pagination/consumer";
import {
  PrivateBreachesBaseProps,
  PrivateBreachesComponent,
} from "./private-breaches.component";
const config: PaginationConfig<BreachesFirstTokenParams, BreachItemView> = {
  tokenEndpoint: carbonConnector.getBreachesPaginationToken,
  pageEndpoint: carbonConnector.getBreachesPage,
  batchLiveEndpoint: carbonConnector.liveBreachesBatch,
};
const ConnectedPrivateBreaches = connectPagination(
  config,
  PrivateBreachesComponent
);
const filterCriteria: BreachesFilterCriterium[] = [
  {
    field: "breachType",
    type: "equals",
    value: "private",
  },
  {
    field: "status",
    type: "differs",
    value: BreachStatus.ACKNOWLEDGED,
  },
];
const sortCriteria: BreachesSortCriterium[] = [
  {
    field: "eventDate",
    direction: "descend",
  },
];
const breachesFirstTokenParams: BreachesFirstTokenParams = {
  sortCriteria: sortCriteria,
  filterCriteria: filterCriteria,
  initialBatchSize: 20,
};
export const PrivateBreaches = (props: PrivateBreachesBaseProps) => (
  <ConnectedPrivateBreaches tokenParams={breachesFirstTokenParams} {...props} />
);
