import { Observable } from "rxjs";
import { Channel } from "./channel";
import { ChannelsListener } from "./channels-listener";
import { Startable } from "./startable";
export interface Connection {
  disconnect: () => void;
}
export interface MessageBroker<TMessage> {
  readonly connect: (
    staticChannels: Channel[],
    listener: ChannelsListener
  ) => Startable;
  readonly sendMessage: (
    mailbox: string,
    message: TMessage
  ) => Observable<TMessage>;
  readonly trySendMessage: (
    mailbox: string,
    message: TMessage
  ) => Promise<boolean>;
}
export interface DeliveryMetadata {
  readonly isReminder: boolean;
}
export type LocalMailboxDefinition<TMessage> = {
  readonly type: "local";
  readonly onMessage: (
    mailbox: string,
    message: TMessage,
    metadata: DeliveryMetadata
  ) => Observable<TMessage>;
};
export type RemoteMailboxDefinition = {
  type: "remote";
  channel: Channel;
};
export type MailboxDefinition =
  | LocalMailboxDefinition<any>
  | RemoteMailboxDefinition;
export type MessageBrokerMailboxesDefinition = {
  [mailBoxId: string]: MailboxDefinition;
};
export interface MessageRoute {
  send: (
    mailbox: string,
    message: unknown,
    metadata: DeliveryMetadata
  ) => Observable<unknown>;
  trySend: (
    mailbox: string,
    message: unknown,
    metadata: DeliveryMetadata
  ) => Promise<boolean>;
}
