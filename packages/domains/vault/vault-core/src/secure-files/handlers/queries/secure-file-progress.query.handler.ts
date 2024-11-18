import {
  type IQueryHandler,
  QueryHandler,
} from "@dashlane/framework-application";
import {
  ProgressStatus,
  SecureFileProgressQuery,
} from "@dashlane/vault-contracts";
import { success } from "@dashlane/framework-types";
import { distinctUntilChanged, finalize, map } from "rxjs";
import { SecureFilesProgressStore } from "../../stores";
@QueryHandler(SecureFileProgressQuery)
export class SecureFileProgressQueryHandler
  implements IQueryHandler<SecureFileProgressQuery>
{
  constructor(private progressStore: SecureFilesProgressStore) {}
  execute({ body }: SecureFileProgressQuery) {
    return this.progressStore.state$.pipe(
      map((state) => state[body.secureFileKey] ?? ProgressStatus.NotStarted),
      distinctUntilChanged(),
      map(success),
      finalize(() => this.progressStore.set({}))
    );
  }
}
