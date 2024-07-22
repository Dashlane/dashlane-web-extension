import {
  CommandHandler,
  FrameworkRequestContextValues,
  ICommandHandler,
  RequestContext,
} from "@dashlane/framework-application";
import {
  Status,
  UpdatePendingCollectionsCommand,
} from "@dashlane/sharing-contracts";
import { success } from "@dashlane/framework-types";
import { PendingCollectionsStore } from "../../store/pending-collections.store";
@CommandHandler(UpdatePendingCollectionsCommand)
export class UpdatePendingCollectionsCommandHandler
  implements ICommandHandler<UpdatePendingCollectionsCommand>
{
  constructor(
    private store: PendingCollectionsStore,
    private context: RequestContext
  ) {}
  execute({ body }: UpdatePendingCollectionsCommand) {
    const collections = body;
    const currentUserLogin = this.getCurrentUserLogin();
    const pendingCollections = collections.filter((collection) => {
      return (collection.users || []).some(
        (userMember) =>
          userMember.login === currentUserLogin &&
          userMember.status === Status.Pending
      );
    });
    this.store.set({ pendingCollections });
    return Promise.resolve(success(undefined));
  }
  getCurrentUserLogin(): string | undefined {
    return this.context.get<string>(FrameworkRequestContextValues.UserName);
  }
}
