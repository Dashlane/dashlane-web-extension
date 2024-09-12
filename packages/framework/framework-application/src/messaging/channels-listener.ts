import { BehaviorSubject, Observable } from "rxjs";
import { Channel } from "./channel";
export interface ChannelsListener {
  readonly connectedChannels$: Observable<Record<string, Channel>>;
}
export const NoDynamicChannels: ChannelsListener = {
  connectedChannels$: new BehaviorSubject({}),
};
export const createSingleChannelListener = (
  channel: Channel
): ChannelsListener => ({
  connectedChannels$: new BehaviorSubject({ channel }),
});
