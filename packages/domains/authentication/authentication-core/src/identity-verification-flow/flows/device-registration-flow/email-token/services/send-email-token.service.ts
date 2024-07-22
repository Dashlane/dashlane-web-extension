import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
import { IdentityVerificationService } from "../../../../services/identity-verification.service";
interface Params {
  login?: string;
}
@Injectable()
export class SendEmailToken {
  public constructor(
    private identityVerificationService: IdentityVerificationService
  ) {
    this.identityVerificationService = identityVerificationService;
  }
  public async execute({ login }: Params) {
    if (login) {
      const askTokenResult =
        await this.identityVerificationService.askServerToSendToken(login);
      if (isFailure(askTokenResult)) {
        return Promise.reject(askTokenResult.error);
      }
    }
    Promise.resolve(undefined);
  }
}
