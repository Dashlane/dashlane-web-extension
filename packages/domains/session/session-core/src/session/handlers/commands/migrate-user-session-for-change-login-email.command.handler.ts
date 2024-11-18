import { firstValueFrom } from "rxjs";
import { CarbonLegacyClient } from "@dashlane/communication";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import {
  arrayBufferToBase64,
  textToArrayBuffer,
} from "@dashlane/framework-encoding";
import {
  failure,
  isFailure,
  isSuccess,
  success,
} from "@dashlane/framework-types";
import { DeviceRegistrationClient } from "@dashlane/authentication-contracts";
import { CopyUserDataAndOpenSessionCommand } from "@dashlane/session-contracts";
import { SessionsStateStore } from "../../stores/sessions-state.store";
import { SessionKeyEncryptor } from "../../session-key";
import { makeDerivationConfig } from "../../crypto-config/helpers";
import { CurrentSessionInfoRepository } from "../../services/current-session-infos.repository";
import { OpenedSession } from "../../stores/session-state.types";
import { SessionsCryptoSettingsStore } from "../../stores/sessions-crypto-settings.store";
@CommandHandler(CopyUserDataAndOpenSessionCommand)
export class CopyUserDataAndOpenSessionCommandHandler
  implements ICommandHandler<CopyUserDataAndOpenSessionCommand>
{
  constructor(
    private carbon: CarbonLegacyClient,
    private store: SessionsStateStore,
    private encryptor: SessionKeyEncryptor,
    private currentSessionInfoRepository: CurrentSessionInfoRepository,
    private deviceRegistration: DeviceRegistrationClient,
    private cryptoSettingsStore: SessionsCryptoSettingsStore
  ) {}
  async execute({
    body: { currentEmail, newEmail, personalSettings },
  }: CopyUserDataAndOpenSessionCommand) {
    const sessionStoreState = await this.store.getState();
    if (
      !(currentEmail in sessionStoreState) ||
      sessionStoreState[currentEmail].status !== "open"
    ) {
      return failure({ tag: "Current email is not authenticated" });
    }
    const { localKey, sessionKey } = sessionStoreState[
      currentEmail
    ] as OpenedSession;
    if (sessionKey.type === "sso") {
      return failure({ tag: "SSO not supported yet" });
    }
    const { analytics, deviceKeys, cryptoSettings } = await firstValueFrom(
      this.currentSessionInfoRepository.getInfos()
    );
    const deviceRegistrationResult =
      await this.deviceRegistration.commands.registerDevice({
        with: "deviceKeys",
        deviceAccessKey: deviceKeys.accessKey,
        deviceSecretKey: deviceKeys.secretKey,
        login: newEmail,
        settings: personalSettings.content,
        userAnalyticsId: analytics.userId,
      });
    if (!isSuccess(deviceRegistrationResult)) {
      return failure({
        tag: `Device registration failed with code: ${deviceRegistrationResult.error.tag}`,
      });
    }
    const encryptedLk = localKey
      ? await this.encryptor.encrypt(textToArrayBuffer(localKey), sessionKey, {
          derivation: makeDerivationConfig(cryptoSettings.cryptoUserPayload),
          salt: cryptoSettings.cryptoFixedSalt,
        })
      : null;
    const cryptoSettingsState = await this.cryptoSettingsStore.getState();
    await this.cryptoSettingsStore.set({
      ...cryptoSettingsState,
      [newEmail]: {
        derivation: makeDerivationConfig(cryptoSettings.cryptoUserPayload),
        salt: cryptoSettings.cryptoFixedSalt,
      },
    });
    await this.store.set({
      ...sessionStoreState,
      [currentEmail]: {
        status: "closed",
        encryptedLocalKey: encryptedLk
          ? arrayBufferToBase64(encryptedLk)
          : null,
      },
      [newEmail]: {
        status: "closed",
        encryptedLocalKey: encryptedLk
          ? arrayBufferToBase64(encryptedLk)
          : null,
      },
    });
    try {
      const loginResult =
        await this.carbon.commands.openSessionWithMasterPassword({
          login: newEmail,
          password: sessionKey.masterPassword,
          rememberPassword: false,
          serverKey: sessionKey.secondaryKey,
          loginType: "MasterPassword",
        });
      if (isFailure(loginResult)) {
        return failure({ tag: "Failed to open session in carbon" });
      }
    } catch (error) {
      return failure({ tag: "Failed to open session in carbon" });
    }
    return success(undefined);
  }
}
