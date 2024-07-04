import { Module } from '@dashlane/framework-application';
import { changeMasterPasswordApi } from '@dashlane/session-contracts';
import { ChangeMasterPasswordEventsEmitterService } from './services';
import { TemporarySendMasterPasswordChangedEventCommandHandler } from './handlers/commands';
@Module({
    api: changeMasterPasswordApi,
    handlers: {
        commands: {
            temporarySendMasterPasswordChangedEvent: TemporarySendMasterPasswordChangedEventCommandHandler,
        },
        events: {},
        queries: {},
    },
    providers: [ChangeMasterPasswordEventsEmitterService],
})
export class ChangeMasterPasswordModule {
}
