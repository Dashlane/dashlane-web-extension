import { Module, useEventsOfModule } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import {
  SESSION_FEATURE_FLIPS,
  sessionApi,
  SessionKeyChecker,
} from "@dashlane/session-contracts";
import { CryptographyModule } from "@dashlane/framework-dashlane-application";
import { carbonLegacyApi } from "@dashlane/communication";
import { LocalDataKeyDecryptor } from "./local-data-key/local-data-key-decryptor";
import { LocalDataKeyEncryptor } from "./local-data-key/local-data-key-encryptor";
import { LocalDataKeyEncryptionCodec } from "./local-data-key/local-data-key-encryption-codec";
import { SessionKeyDecryptor, SessionKeyEncryptor } from "./session-key";
import { SessionKeyCryptoSettingsRepository } from "./session-key/session-key-crypto-repository";
import { FlushLocalDataCommandHandler } from "./handlers/commands/flush-local-data.command.handler";
import { PrepareLocalDataFlushCommandHandler } from "./handlers/commands/prepare-local-data-flush.command.handler";
import { CreateUserSessionCommandHandler } from "./handlers/commands/create-user-session.command.handler";
import { CloseUserSessionCommandHandler } from "./handlers/commands/close-user-session.command.handler";
import { OpenUserSessionCommandHandler } from "./handlers/commands/open-user-session.command.handler";
import { SessionEventEmitter } from "./event-emiter";
import { SelectedOpenedSessionQueryHandler } from "./handlers/queries/selected-opened-session-query-handler";
import { DeleteLocalSessionCommandHandler } from "./handlers/commands/delete-local-user-session.command.handler";
import { SessionsStateStore } from "./stores/sessions-state.store";
import { SessionsCryptoSettingsStore } from "./stores/sessions-crypto-settings.store";
import { CarbonLegacySessionEventHandler } from "./handlers/events";
import { LocalDataKeyRepository } from "./local-data-key/local-data-key-repository";
import { SessionStoreCodec } from "./stores/session-store-codec";
import { CryptoBasedSessionKeyChecker } from "./services/crypto-based-session-key-checker";
import { CheckSessionKeyQueryHandler } from "./handlers/queries/check-session-key.query.handler";
import { SessionKeyVerifier } from "./session-key/session-key-verifier";
import { CarbonLegacyDeviceRemotelyDeletedEventHandler } from "./handlers/events/carbon-legacy-device-remotely-deleted.event.handler";
import { UpdateUserSessionKeyCommandHandler } from "./handlers/commands/update-user-session-key.command.handler";
import { CloseSessionOnIdleCronHandler } from "./handlers/crons/close-session-on-idle.cron.handler";
import { SessionKeyExporter } from "./services/session-key-exporter";
import { ExportSessionKeyQueryHandler } from "./handlers/queries/export-session-key-query.handler";
import { ExportSessionKeyCryptoStore } from "./stores/export-session-key.store";
import { SessionKeyImporter } from "./services/session-key-importer";
import { ExportedSessionKeyCryptoManager } from "./services/exported-session-key-crypto-manager";
import { SessionConfig } from "./infra/session-infra";
import { CurrentSessionInfoQueryHandler } from "./handlers/queries/current-session-info.query.handler";
import { LocalSessionsQueryHandler } from "./handlers/queries/created-sessions.query.handler";
import { CurrentSessionInfoRepository } from "./services/current-session-infos.repository";
import { SessionServerApiCredentialsRepository } from "./server-credentials-repository/session-server-api-credentials.repository";
import { CopyUserDataAndOpenSessionCommandHandler } from "./handlers/commands/migrate-user-session-for-change-login-email.command.handler";
@Module({
  api: sessionApi,
  crons: [
    {
      handler: CloseSessionOnIdleCronHandler,
      periodInMinutes: 1,
      name: "close-session-idle-cron",
      scope: UseCaseScope.User,
    },
  ],
  handlers: {
    commands: {
      flushLocalData: FlushLocalDataCommandHandler,
      prepareLocalDataFlush: PrepareLocalDataFlushCommandHandler,
      closeUserSession: CloseUserSessionCommandHandler,
      createUserSession: CreateUserSessionCommandHandler,
      openUserSession: OpenUserSessionCommandHandler,
      deleteLocalSession: DeleteLocalSessionCommandHandler,
      copyUserDataAndOpenSession: CopyUserDataAndOpenSessionCommandHandler,
      updateUserSessionKey: UpdateUserSessionKeyCommandHandler,
    },
    events: {
      ...useEventsOfModule(carbonLegacyApi, {
        carbonLegacy: CarbonLegacySessionEventHandler,
        CarbonLegacyDeviceRemotelyDeleted:
          CarbonLegacyDeviceRemotelyDeletedEventHandler,
      }),
    },
    queries: {
      selectedOpenedSession: SelectedOpenedSessionQueryHandler,
      checkSessionKey: CheckSessionKeyQueryHandler,
      exportSessionKey: ExportSessionKeyQueryHandler,
      currentSessionInfo: CurrentSessionInfoQueryHandler,
      localSessions: LocalSessionsQueryHandler,
    },
  },
  providers: [
    SessionEventEmitter,
    LocalDataKeyDecryptor,
    LocalDataKeyEncryptor,
    LocalDataKeyEncryptionCodec,
    LocalDataKeyRepository,
    SessionKeyDecryptor,
    SessionKeyEncryptor,
    SessionKeyVerifier,
    SessionKeyCryptoSettingsRepository,
    SessionStoreCodec,
    CurrentSessionInfoRepository,
    SessionServerApiCredentialsRepository,
    {
      provide: SessionKeyChecker,
      useClass: CryptoBasedSessionKeyChecker,
    },
    SessionKeyExporter,
    SessionKeyImporter,
    ExportedSessionKeyCryptoManager,
  ],
  exports: [
    LocalDataKeyDecryptor,
    LocalDataKeyEncryptor,
    LocalDataKeyEncryptionCodec,
    SessionKeyChecker,
    CurrentSessionInfoRepository,
    SessionServerApiCredentialsRepository,
  ],
  stores: [
    SessionsStateStore,
    SessionsCryptoSettingsStore,
    ExportSessionKeyCryptoStore,
  ],
  imports: [CryptographyModule],
  configurations: {
    session: { token: SessionConfig },
  },
  requiredFeatureFlips: Object.values(SESSION_FEATURE_FLIPS),
})
export class SessionModule {}
