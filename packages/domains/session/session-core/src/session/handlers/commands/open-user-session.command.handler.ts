import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { failure, isSuccess, success } from "@dashlane/framework-types";
import {
  MultiAccountNotYetSupported,
  OpenUserSessionCommand,
  SessionAlreadyOpened,
  SessionNotCreated,
} from "@dashlane/session-contracts";
import { CarbonLegacyClient } from "@dashlane/communication";
import {
  SessionsStateStore,
  SessionStoreMutex,
} from "../../stores/sessions-state.store";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from "@dashlane/framework-encoding";
import { SessionKeyDecryptor } from "../../session-key";
import { SessionKeyImporter } from "../../services/session-key-importer";
@CommandHandler(OpenUserSessionCommand)
export class OpenUserSessionCommandHandler
  implements ICommandHandler<OpenUserSessionCommand>
{
  constructor(
    private carbon: CarbonLegacyClient,
    private sessionStore: SessionsStateStore,
    private sessionKeyDecryptor: SessionKeyDecryptor,
    private importer: SessionKeyImporter
  ) {}
  async execute({
    body: { email, sessionKey, rememberPassword },
  }: OpenUserSessionCommand) {
    const nonExportedSessionKey =
      sessionKey.type === "exported"
        ? await this.importer.import(sessionKey)
        : sessionKey;
    if (nonExportedSessionKey.type === "sso") {
      throw new Error("not implemented");
    }
    const { sessionStore, carbon } = this;
    return await SessionStoreMutex.runExclusive(async () => {
      const sessionsStateBeforeOpening = await sessionStore.getState();
      if (!(email in sessionsStateBeforeOpening)) {
        return failure(new SessionNotCreated());
      }
      if (
        Object.values(sessionsStateBeforeOpening).some(
          (s) => s.status === "open"
        )
      ) {
        return failure(new MultiAccountNotYetSupported());
      }
      const sessionToOpen = sessionsStateBeforeOpening[email];
      if (
        sessionToOpen.status === "open" ||
        sessionToOpen.status === "opening"
      ) {
        return failure(new SessionAlreadyOpened());
      }
      await sessionStore.set({
        ...sessionsStateBeforeOpening,
        [email]: {
          status: "opening",
          sessionKey: nonExportedSessionKey,
          localKey: sessionToOpen.encryptedLocalKey
            ? arrayBufferToBase64(
                await this.sessionKeyDecryptor.decrypt(
                  base64ToArrayBuffer(sessionToOpen.encryptedLocalKey),
                  nonExportedSessionKey
                )
              )
            : null,
        },
      });
      let successInCarbon = false;
      try {
        const openSessionInCarbon =
          await carbon.commands.openSessionWithMasterPassword({
            login: email,
            password: nonExportedSessionKey.masterPassword,
            rememberPassword: rememberPassword,
            requiredPermissions: undefined,
            serverKey: nonExportedSessionKey.secondaryKey,
            loginType: "MasterPassword",
          });
        if (!isSuccess(openSessionInCarbon)) {
          throw new Error("Failed to open session in carbon");
        }
        successInCarbon = true;
        return success(undefined);
      } finally {
        if (!successInCarbon) {
          await sessionStore.set(sessionsStateBeforeOpening);
        }
      }
    });
  }
}
