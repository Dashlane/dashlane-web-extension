import { success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import {} from "@dashlane/framework-encoding";
import { UpdateSharedCollectionsCommand } from "@dashlane/sharing-contracts";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@CommandHandler(UpdateSharedCollectionsCommand)
export class UpdateSharedCollectionsCommandHandler
  implements ICommandHandler<UpdateSharedCollectionsCommand>
{
  constructor(private collectionsRepository: SharedCollectionsRepository) {}
  async execute({ body }: UpdateSharedCollectionsCommand) {
    await this.collectionsRepository.updateCollections(body.collections);
    return success(undefined);
  }
}
