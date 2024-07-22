import { Module } from "@dashlane/framework-application";
import { SharingCarbonHelpersModule } from "../sharing-carbon-helpers";
import { SharingCryptographyService } from "./services/sharing-cryptography.service";
import { SharingDecryptionService } from "./services/sharing-decryption.service";
import { SharingInvitesCryptoService } from "./services/sharing-invites-crypto.service";
import { CryptographyModule } from "@dashlane/framework-dashlane-application";
@Module({
  sharedModuleName: "sharing-crypto",
  providers: [
    SharingCryptographyService,
    SharingDecryptionService,
    SharingInvitesCryptoService,
  ],
  exports: [
    SharingCryptographyService,
    SharingDecryptionService,
    SharingInvitesCryptoService,
  ],
  imports: [SharingCarbonHelpersModule, CryptographyModule],
})
export class SharingCryptoModule {}
