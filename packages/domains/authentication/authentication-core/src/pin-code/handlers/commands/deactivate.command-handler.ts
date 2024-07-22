import { DeactivateCommand } from "@dashlane/authentication-contracts";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { Result, success } from "@dashlane/framework-types";
import { PinCodeService } from "../../services/pin-code.service";
@CommandHandler(DeactivateCommand)
export class DeactivateCommandHandler
  implements ICommandHandler<DeactivateCommand>
{
  constructor(private readonly pinCodeService: PinCodeService) {}
  public async execute(): Promise<Result<undefined>> {
    await this.pinCodeService.deactivatePinCode();
    return success(undefined);
  }
}
