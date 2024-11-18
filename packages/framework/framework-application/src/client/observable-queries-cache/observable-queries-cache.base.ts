import { IObservableQueriesCacheFor } from "./observable-queries-cache.types";
import { AnyAppDefinition, QueryMessage } from "@dashlane/framework-contracts";
import { AnyFunctionalError, Class } from "@dashlane/framework-types";
export abstract class ObservableQueriesCacheBase<
  TAppDefinition extends AnyAppDefinition
> {
  public abstract for(
    definition: TAppDefinition,
    apiName: string,
    queryName: string,
    queryBody: unknown
  ): IObservableQueriesCacheFor<
    Class<QueryMessage<unknown, unknown, AnyFunctionalError>, unknown[]>
  >;
}
