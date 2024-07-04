import { CarbonLegacyClient } from '@dashlane/communication';
import { CommandHandler, ICommandHandler, } from '@dashlane/framework-application';
import { assertUnreachable, failure, isFailure, success, } from '@dashlane/framework-types';
import { CreateUserSessionCommand, SessionAlreadyExists, SessionState, } from '@dashlane/session-contracts';
import { SessionsStateStore, SessionStoreMutex, } from '../../stores/sessions-state.store';
import { LocalDataKeyRepository } from '../../local-data-key/local-data-key-repository';
import { SessionKeyEncryptor } from '../../session-key';
import { makeDerivationConfig } from '../../crypto-config/helpers';
import { arrayBufferToBase64 } from '@dashlane/framework-encoding';
import { SessionKeyImporter } from '../../services/session-key-importer';
@CommandHandler(CreateUserSessionCommand)
export class CreateUserSessionCommandHandler implements ICommandHandler<CreateUserSessionCommand> {
    constructor(private carbon: CarbonLegacyClient, private store: SessionsStateStore, private localKeyRepository: LocalDataKeyRepository, private encryptor: SessionKeyEncryptor, private importer: SessionKeyImporter) { }
    async execute({ body: { sessionKey, email, personalSettings }, }: CreateUserSessionCommand) {
        const noExportSessionKey = sessionKey.type === 'exported'
            ? await this.importer.import(sessionKey)
            : sessionKey;
        const localKey = await this.localKeyRepository.generate();
        const encryptedLk = localKey
            ? await this.encryptor.encrypt(localKey, noExportSessionKey, {
                derivation: makeDerivationConfig(personalSettings.CryptoUserPayload),
                salt: personalSettings.CryptoFixedSalt,
            })
            : null;
        return await SessionStoreMutex.runExclusive(async () => {
            const storeState = await this.store.getState();
            if (email in storeState) {
                return failure(new SessionAlreadyExists());
            }
            switch (noExportSessionKey.type) {
                case 'mp': {
                    await this.store.set({
                        ...storeState,
                        [email]: {
                            status: SessionState.Closed,
                            encryptedLocalKey: encryptedLk
                                ? arrayBufferToBase64(encryptedLk)
                                : null,
                        },
                    });
                    const loginResult = await this.carbon.commands.openSessionWithMasterPassword({
                        login: email,
                        password: noExportSessionKey.masterPassword,
                        rememberPassword: false,
                        requiredPermissions: undefined,
                        serverKey: noExportSessionKey.secondaryKey,
                        loginType: 'MasterPassword',
                    });
                    if (isFailure(loginResult)) {
                        throw new Error('Failed to create the session in carbon');
                    }
                    return success(undefined);
                }
                case 'sso':
                    throw new Error(`Creating a SSO session in session module is not supported`);
                default:
                    assertUnreachable(noExportSessionKey);
            }
        });
    }
}
