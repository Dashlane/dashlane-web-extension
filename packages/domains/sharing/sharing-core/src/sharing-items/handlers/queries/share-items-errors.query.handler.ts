import { map } from "rxjs";
import { safeCast, success } from "@dashlane/framework-types";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import {
  ShareableItemType,
  ShareCredentialError,
  ShareItemError,
  ShareItemsErrorsQuery,
  ShareNoteError,
} from "@dashlane/sharing-contracts";
import { ShareItemsErrorsStore } from "../../store/share-items-errors.store";
@QueryHandler(ShareItemsErrorsQuery)
export class ShareItemsErrorQueryHandler
  implements IQueryHandler<ShareItemsErrorsQuery>
{
  constructor(private store: ShareItemsErrorsStore) {}
  execute(): QueryHandlerResponseOf<ShareItemsErrorsQuery> {
    return this.store.state$.pipe(
      map((state) => {
        if (state.hasErrors) {
          return success(
            state.errors.reduce(
              (acc, error) => {
                const { id, type, title, error: reason } = error;
                const base = {
                  id,
                  title,
                  reason,
                };
                switch (type) {
                  case ShareableItemType.Credential:
                    acc.credentialsErrors.push({
                      ...base,
                      domain: error.domain,
                      text: error.text,
                    });
                    break;
                  case ShareableItemType.SecureNote:
                    acc.notesErrors.push({
                      ...base,
                      color: error.color,
                    });
                    break;
                  default:
                    acc.secretsErrors.push({ ...base });
                    break;
                }
                return acc;
              },
              {
                credentialsErrors: safeCast<ShareCredentialError[]>([]),
                notesErrors: safeCast<ShareNoteError[]>([]),
                secretsErrors: safeCast<ShareItemError[]>([]),
              }
            )
          );
        } else {
          return success({
            credentialsErrors: [],
            notesErrors: [],
            secretsErrors: [],
          });
        }
      })
    );
  }
}
