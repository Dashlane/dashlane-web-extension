import { ActivateCommand } from "@dashlane/authentication-contracts";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { Result, success } from "@dashlane/framework-types";
import { PinCodeService } from "../../services/pin-code.service";
@CommandHandler(ActivateCommand)
export class ActivateCommandHandler
  implements ICommandHandler<ActivateCommand>
{
  constructor(private readonly pinCodeService: PinCodeService) {}
  public async execute({ body }: ActivateCommand): Promise<Result<undefined>> {
    await this.pinCodeService.activatePinCode(body.pinCode);
    return success(undefined);
  }
}
