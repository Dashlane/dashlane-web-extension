import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import {
  failure,
  getSuccess,
  isFailure,
  success,
} from "@dashlane/framework-types";
import {
  AddIdResultSuccess,
  AddPasskeyResultSuccess,
  CarbonLegacyClient,
  SavePersonalDataItemResponse,
} from "@dashlane/communication";
import {
  CreateVaultItemCommand,
  DriversLicense,
  FiscalId,
  IdCard,
  IdVaultItemType,
  Passkey,
  Passport,
  SocialSecurityId,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { VaultItemsCommandEventsEmitter } from "../../events/events-emitter";
import { carbonSaveTypeMapperDictionary } from "./carbon-save.types";
@CommandHandler(CreateVaultItemCommand)
export class CreateVaultItemCommandHandler
  implements ICommandHandler<CreateVaultItemCommand>
{
  constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private eventEmitter: VaultItemsCommandEventsEmitter
  ) {}
  async execute({
    body,
  }: CreateVaultItemCommand): CommandHandlerResponseOf<CreateVaultItemCommand> {
    const { vaultItemType, content, shouldSkipSync } = body;
    if (
      [
        VaultItemType.DriversLicense,
        VaultItemType.FiscalId,
        VaultItemType.IdCard,
        VaultItemType.Passport,
        VaultItemType.SocialSecurityId,
      ].includes(vaultItemType)
    ) {
      return this.createId(vaultItemType as IdVaultItemType, content);
    }
    if (vaultItemType === VaultItemType.Passkey) {
      return this.createPasskey(content);
    }
    const { commands } = this.carbonLegacyClient;
    const result = await commands.carbonLegacyLeeloo({
      name: "savePersonalDataItem",
      arg: [
        {
          kwType: vaultItemType,
          origin: "MANUAL",
          content: carbonSaveTypeMapperDictionary[vaultItemType](content),
          shouldSkipSync,
        },
      ],
    });
    if (isFailure(result)) {
      return this.handleError(vaultItemType);
    }
    const carbonResponse = getSuccess(result).carbonResult as Omit<
      SavePersonalDataItemResponse,
      "success"
    >;
    return this.handleSuccess(vaultItemType, carbonResponse.itemId);
  }
  private handleError(vaultItemType: VaultItemType) {
    return Promise.resolve(
      failure({
        tag: "error",
        errorMessage: `Failed to create ${vaultItemType}`,
      })
    );
  }
  private handleSuccess(vaultItemType: VaultItemType, id: string) {
    this.eventEmitter.sendEvent("created", {
      ids: [id],
      vaultItemType,
    });
    return Promise.resolve(
      success({
        id,
      })
    );
  }
  private async createId(
    idVaultItemType: IdVaultItemType,
    content: Partial<
      DriversLicense | FiscalId | IdCard | Passport | SocialSecurityId
    >
  ) {
    const {
      commands: {
        addDriverLicense,
        addFiscalId,
        addIdCard,
        addPassport,
        addSocialSecurityId,
      },
    } = this.carbonLegacyClient;
    const itemTypeCommandMapper = {
      [VaultItemType.DriversLicense]: addDriverLicense,
      [VaultItemType.FiscalId]: addFiscalId,
      [VaultItemType.IdCard]: addIdCard,
      [VaultItemType.Passport]: addPassport,
      [VaultItemType.SocialSecurityId]: addSocialSecurityId,
    };
    const createResult = await itemTypeCommandMapper[idVaultItemType](
      carbonSaveTypeMapperDictionary[idVaultItemType](content)
    );
    if (isFailure(createResult)) {
      return this.handleError(idVaultItemType);
    }
    return this.handleSuccess(
      idVaultItemType,
      (getSuccess(createResult) as AddIdResultSuccess).id
    );
  }
  private async createPasskey(content: Passkey) {
    const {
      commands: { addPasskey },
    } = this.carbonLegacyClient;
    const createResult = await addPasskey(content);
    if (isFailure(createResult)) {
      return this.handleError(VaultItemType.Passkey);
    }
    return this.handleSuccess(
      VaultItemType.Passkey,
      (getSuccess(createResult) as AddPasskeyResultSuccess).id
    );
  }
}
