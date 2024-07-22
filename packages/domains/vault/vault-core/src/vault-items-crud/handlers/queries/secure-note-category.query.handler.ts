import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { SecureNoteCategoryQuery } from "@dashlane/vault-contracts";
import { mapSuccessObservable } from "@dashlane/framework-types";
import { CarbonLegacyClient } from "@dashlane/communication";
import { isSecureNoteCategory } from "../../../vault-repository/carbon-guards";
@QueryHandler(SecureNoteCategoryQuery)
export class SecureNoteCategoryQueryHandler
  implements IQueryHandler<SecureNoteCategoryQuery>
{
  constructor(private carbonLegacyClient: CarbonLegacyClient) {}
  public execute({
    body: { id },
  }: SecureNoteCategoryQuery): QueryHandlerResponseOf<SecureNoteCategoryQuery> {
    const {
      queries: { carbonState },
    } = this.carbonLegacyClient;
    return carbonState({
      path: "userSession.personalData.noteCategories",
    }).pipe(
      mapSuccessObservable((secureNoteCategories) => {
        if (!isSecureNoteCategory(secureNoteCategories)) {
          throw new Error("Bad secure note category format");
        }
        if (id === undefined) {
          return secureNoteCategories;
        }
        const secureNoteCategoryName = secureNoteCategories.find(
          (secureNoteCategory) => secureNoteCategory.Id === id
        )?.CategoryName;
        return secureNoteCategoryName;
      })
    );
  }
}
