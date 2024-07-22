import { LoginWithPinCodeCommand } from "@dashlane/authentication-contracts";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { PinCodeService } from "../../services/pin-code.service";
@CommandHandler(LoginWithPinCodeCommand)
export class LoginWithPinCodeCommandHandler
  implements ICommandHandler<LoginWithPinCodeCommand>
{
  constructor(private readonly pinCodeService: PinCodeService) {}
  public async execute({
    body,
  }: LoginWithPinCodeCommand): CommandHandlerResponseOf<LoginWithPinCodeCommand> {
    return await this.pinCodeService.loginWithPinCode(body.email, body.pinCode);
  }
}
