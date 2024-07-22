import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { failure, isFailure, success } from "@dashlane/framework-types";
import { CarbonLegacyClient } from "@dashlane/communication";
import {
  DriversLicense,
  FiscalId,
  IdCard,
  IdVaultItemType,
  Passkey,
  Passport,
  SocialSecurityId,
  UpdateVaultItemCommand,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { VaultItemsCommandEventsEmitter } from "../events/events-emitter";
import { carbonSaveTypeMapperDictionary } from "./create-command/carbon-save.types";
@CommandHandler(UpdateVaultItemCommand)
export class UpdateVaultItemCommandHandler
  implements ICommandHandler<UpdateVaultItemCommand>
{
  constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private eventEmitter: VaultItemsCommandEventsEmitter
  ) {}
  async execute({
    body,
  }: UpdateVaultItemCommand): CommandHandlerResponseOf<UpdateVaultItemCommand> {
    const { content, id, vaultItemType, shouldSkipSync } = body;
    if (
      [
        VaultItemType.DriversLicense,
        VaultItemType.FiscalId,
        VaultItemType.IdCard,
        VaultItemType.Passport,
        VaultItemType.SocialSecurityId,
      ].includes(vaultItemType)
    ) {
      return this.updateId(vaultItemType as IdVaultItemType, content, id);
    }
    if (vaultItemType === VaultItemType.Passkey) {
      return this.updatePasskey(content, id);
    }
    const { commands } = this.carbonLegacyClient;
    const result = await commands.carbonLegacyLeeloo({
      name: "savePersonalDataItem",
      arg: [
        {
          kwType: vaultItemType,
          origin: "MANUAL",
          content: {
            ...carbonSaveTypeMapperDictionary[vaultItemType](content),
            id: id,
          },
          shouldSkipSync,
        },
      ],
    });
    if (isFailure(result)) {
      return Promise.resolve(
        failure({
          tag: "error",
          errorMessage: `Failed to update ${vaultItemType}`,
        })
      );
    }
    this.eventEmitter.sendEvent("updated", { ids: [id], vaultItemType });
    return Promise.resolve(success(undefined));
  }
  private handleError(vaultItemType: VaultItemType) {
    return Promise.resolve(
      failure({
        tag: "error",
        errorMessage: `Failed to update ${vaultItemType}`,
      })
    );
  }
  private handleSuccess(vaultItemType: VaultItemType, id: string) {
    this.eventEmitter.sendEvent("updated", { ids: [id], vaultItemType });
    return Promise.resolve(success(undefined));
  }
  private async updateId(
    idVaultItemType: IdVaultItemType,
    content: Partial<
      DriversLicense | FiscalId | IdCard | Passport | SocialSecurityId
    >,
    id: string
  ) {
    const {
      commands: {
        editDriverLicense,
        editFiscalId,
        editIdCard,
        editPassport,
        editSocialSecurityId,
      },
    } = this.carbonLegacyClient;
    const itemTypeCommandMapper = {
      [VaultItemType.DriversLicense]: editDriverLicense,
      [VaultItemType.FiscalId]: editFiscalId,
      [VaultItemType.IdCard]: editIdCard,
      [VaultItemType.Passport]: editPassport,
      [VaultItemType.SocialSecurityId]: editSocialSecurityId,
    };
    const updateResult = await itemTypeCommandMapper[idVaultItemType]({
      ...carbonSaveTypeMapperDictionary[idVaultItemType](content),
      id: id,
    });
    if (isFailure(updateResult)) {
      return this.handleError(idVaultItemType);
    }
    return this.handleSuccess(idVaultItemType, id);
  }
  private async updatePasskey(content: Partial<Passkey>, id: string) {
    const {
      commands: { updatePasskey },
    } = this.carbonLegacyClient;
    const createResult = await updatePasskey({
      ...content,
      id: id,
    });
    if (isFailure(createResult)) {
      return this.handleError(VaultItemType.Passkey);
    }
    return this.handleSuccess(VaultItemType.Passkey, id);
  }
}
