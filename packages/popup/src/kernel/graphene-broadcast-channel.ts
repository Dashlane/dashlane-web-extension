export interface CarbonChannelMessage {
    type: string;
    content: any;
}
import { ChannelState, isSendMessageRequest, LowLevelChannel, sendMessageRequest, UnreliableMessage, } from '@dashlane/framework-application';
import { Observable, of, share } from 'rxjs';
export interface MessageEvent {
    readonly data: unknown;
    readonly lastEventId: string;
    readonly origin: string;
}
export type MessageListener = (event: MessageEvent) => void;
const GRAPHENE_CHANNEL_NAME = 'graphene_leeloo_background';
export class GrapheneBroadcastChannel implements LowLevelChannel {
    public readonly autoConnects = true;
    private broadcastChannel: BroadcastChannel;
    constructor(channelName: string) {
        this.broadcastChannel = new BroadcastChannel(channelName);
        this.messages$ = new Observable<UnreliableMessage>((subscriber) => {
            const listener: MessageListener = (event) => {
                if (isSendMessageRequest(event.data) &&
                    event.data.channelName === GRAPHENE_CHANNEL_NAME) {
                    subscriber.next(event.data.message);
                }
            };
            this.broadcastChannel.addEventListener('message', listener);
            return () => {
                this.broadcastChannel.removeEventListener('message', listener);
            };
        }).pipe(share());
    }
    public async sendMessage(message: UnreliableMessage) {
        this.broadcastChannel.postMessage(sendMessageRequest({
            channelName: GRAPHENE_CHANNEL_NAME,
            message,
        }));
        return Promise.resolve();
    }
    public readonly messages$: Observable<UnreliableMessage>;
    public readonly status$ = of(ChannelState.Connected);
    public stop() {
        this.broadcastChannel.close();
        return Promise.resolve();
    }
}
