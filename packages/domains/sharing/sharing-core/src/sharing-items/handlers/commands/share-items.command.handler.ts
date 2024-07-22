import { firstValueFrom } from "rxjs";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { failure, success } from "@dashlane/framework-types";
import {
  createLimitExceededError,
  createPartialSuccessError,
  ShareItemFailureReason,
  ShareItemRequestPayload,
  ShareItemsCommand,
} from "@dashlane/sharing-contracts";
import { SharingSyncService } from "../../../sharing-common";
import { IsSharingAllowedService } from "../common/is-sharing-allowed.service";
import {
  ShareItemErrorDetails,
  ShareItemsErrorsStore,
} from "../../store/share-items-errors.store";
import { ShareItemsService } from "../common/share-items.service";
@CommandHandler(ShareItemsCommand)
export class ShareItemsCommandHandler
  implements ICommandHandler<ShareItemsCommand>
{
  constructor(
    private readonly isSharingAllowedService: IsSharingAllowedService,
    private readonly sharedItemsErrorsStore: ShareItemsErrorsStore,
    private readonly sharingSync: SharingSyncService,
    private readonly shareItemsService: ShareItemsService
  ) {}
  async execute({ body }: ShareItemsCommand) {
    const { vaultItemIds } = body;
    const sharingRemainingLimitResult = await firstValueFrom(
      this.isSharingAllowedService.get()
    );
    if (
      typeof sharingRemainingLimitResult === "boolean"
        ? !sharingRemainingLimitResult
        : vaultItemIds.length > sharingRemainingLimitResult
    ) {
      return failure(createLimitExceededError());
    }
    let hasChanges = false;
    let errors: Array<ShareItemErrorDetails> | null = null;
    const { hasChanges: hasChangesFirstAttempt, errors: errorsFirstAttempt } =
      await this.shareItemsService.run(body);
    hasChanges = hasChangesFirstAttempt;
    errors = errorsFirstAttempt;
    if (this.hasInvalidRevisionErrors(errorsFirstAttempt)) {
      const {
        hasChanges: hasChangesSecondAttempt,
        errors: errorsSecondAttempt,
      } = await this.runShareAttempt({
        ...body,
        vaultItemIds: vaultItemIds.filter((itemId) =>
          errorsFirstAttempt.find((error) => error.id === itemId)
        ),
      });
      errors = errorsSecondAttempt;
      hasChanges = hasChanges || hasChangesSecondAttempt;
    }
    if (hasChanges) {
      this.sharingSync.scheduleSync();
    }
    if (errors.length) {
      this.sharedItemsErrorsStore.set({ hasErrors: true, errors });
      return failure(createPartialSuccessError());
    } else {
      this.sharedItemsErrorsStore.set({ hasErrors: false });
    }
    return success(undefined);
  }
  private hasInvalidRevisionErrors(errors: ShareItemErrorDetails[]) {
    return errors.find(
      ({ error }) => error === ShareItemFailureReason.INVALID_REVISION
    );
  }
  private async runShareAttempt(params: ShareItemRequestPayload) {
    await this.sharingSync.runSync();
    return this.shareItemsService.run(params);
  }
}
