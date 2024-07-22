import { distinctUntilChanged, map, of, switchMap } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import { CurrentSpaceGetterService } from "../../../sharing-carbon-helpers";
import { SharedItemsRepository } from "../common/shared-items-repository";
@Injectable()
export class IsSharingAllowedService {
  constructor(
    private currentSpaceGetter: CurrentSpaceGetterService,
    private sharedItemsRepository: SharedItemsRepository
  ) {}
  public get() {
    return this.currentSpaceGetter.get().pipe(
      map((result) => {
        if (isFailure(result)) {
          throw new Error(
            "Problem retrieving current space information to assess sharing capacity"
          );
        }
        return getSuccess(result).sharedItemsLimit;
      }),
      switchMap((sharedItemsLimit) => {
        if (sharedItemsLimit === undefined) {
          return of(true);
        }
        return this.sharedItemsRepository.sharedItems$().pipe(
          map((sharedItems) => sharedItems.length),
          distinctUntilChanged(),
          map((sharedItemsCount) => {
            return sharedItemsLimit - sharedItemsCount;
          })
        );
      })
    );
  }
}
