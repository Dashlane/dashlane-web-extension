import {
  concat,
  concatMap,
  distinctUntilChanged,
  EMPTY,
  from,
  iif,
  map,
  Observable,
} from "rxjs";
import { DEFAULT_PARAM, EventDeclaration } from "ts-event-bus";
import {
  AnyFunctionalError,
  Class,
  InstanceOf,
  success,
  ValuesType,
} from "@dashlane/framework-types";
import { QueryMessage } from "@dashlane/framework-contracts";
import {
  Injectable,
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
  QueryInfo,
} from "@dashlane/framework-application";
import { queriesFromCarbonAPI } from "@dashlane/communication";
import { CarbonLegacyInfrastructure } from "../carbon-legacy-infrastructure";
type AnyQueryFromCarbonApi = InstanceOf<
  ValuesType<typeof queriesFromCarbonAPI>
>;
@Injectable()
export class CarbonApiQueriesHandler
  implements IQueryHandler<AnyQueryFromCarbonApi>
{
  public constructor(infrastructure: CarbonLegacyInfrastructure) {
    this.infrastructure = infrastructure;
  }
  public execute(query: AnyQueryFromCarbonApi, { name }: QueryInfo) {
    const { carbonQueryName, carbonLiveQueryName } =
      this.getMaybeCarbonQueryNames(name);
    return from(this.infrastructure.getCarbon()).pipe(
      concatMap(({ apiEvents }) =>
        concat(
          iif(
            () => !!carbonQueryName && carbonQueryName in apiEvents,
            from(apiEvents[carbonQueryName](query.body)),
            EMPTY
          ),
          iif(
            () => !!carbonLiveQueryName && carbonLiveQueryName in apiEvents,
            new Observable((subscriber) => {
              const unsub = apiEvents[carbonLiveQueryName].on(
                query.body === undefined ? DEFAULT_PARAM : query.body,
                (value: unknown) => subscriber.next(value)
              );
              return () => {
                unsub();
              };
            }),
            EMPTY
          )
        )
      ),
      distinctUntilChanged(),
      map(success)
    ) as QueryHandlerResponseOf<typeof query>;
  }
  private getMaybeCarbonQueryNames(queryName: string) {
    let carbonQueryName = undefined;
    let carbonLiveQueryName = undefined;
    if (queryName.startsWith("live")) {
      carbonLiveQueryName = queryName;
      carbonQueryName = `get${queryName.substring("live".length)}`;
    } else {
      carbonQueryName = queryName;
    }
    return { carbonQueryName, carbonLiveQueryName };
  }
  private infrastructure: CarbonLegacyInfrastructure;
}
Object.values(queriesFromCarbonAPI).forEach((query) =>
  QueryHandler(query)(CarbonApiQueriesHandler)
);
export function createHandlersConfigForCarbonApiQueries<
  TQueriesConnectorDeclaration extends EventDeclaration,
  TLiveQueriesConnectorDeclaration extends EventDeclaration
>(
  queriesConnector: TQueriesConnectorDeclaration,
  liveQueriesConnector: TLiveQueriesConnectorDeclaration
) {
  const queryNames = Object.keys(queriesConnector);
  const liveQueryNames = Object.keys(liveQueriesConnector);
  return [...queryNames, ...liveQueryNames].reduce(
    (acc, slotName: keyof TQueriesConnectorDeclaration) => {
      return {
        ...acc,
        [slotName]: CarbonApiQueriesHandler,
      };
    },
    {} as {
      [TQuery in
        | keyof TQueriesConnectorDeclaration
        | keyof TLiveQueriesConnectorDeclaration]: Class<
        IQueryHandler<QueryMessage<unknown, unknown, AnyFunctionalError>>,
        never[]
      >;
    }
  );
}
