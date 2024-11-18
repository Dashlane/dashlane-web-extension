import {
  AnyAppDefinition,
  ApisNamesOf,
  NodeIdentifiersOf,
} from "@dashlane/framework-contracts";
import type {
  LocalSubscriptions,
  RemoteChannelsName,
} from "../application/app.types";
import type { Channel } from "./channel";
import type { ChannelsListener } from "./channels-listener";
export class NodeConfiguration<
  TAppDefinition extends AnyAppDefinition = AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> | null = NodeIdentifiersOf<TAppDefinition>,
  TSubscriptions extends LocalSubscriptions<
    TAppDefinition,
    TCurrentNode
  > = LocalSubscriptions<TAppDefinition, TCurrentNode>
> {
  public readonly appDefinition: TAppDefinition;
  public readonly currentNode: TCurrentNode;
  public readonly channels: Record<
    RemoteChannelsName<TAppDefinition, TCurrentNode>,
    Channel
  >;
  public readonly channelsListener: ChannelsListener;
  public readonly subscriptions: TSubscriptions;
  constructor(params: {
    appDefinition: TAppDefinition;
    currentNode: TCurrentNode;
    channels: Record<RemoteChannelsName<TAppDefinition, TCurrentNode>, Channel>;
    subscriptions: TSubscriptions;
    channelsListener: ChannelsListener;
  }) {
    this.appDefinition = params.appDefinition;
    this.currentNode = params.currentNode;
    this.channels = params.channels;
    this.subscriptions = params.subscriptions;
    this.channelsListener = params.channelsListener;
  }
  public getNodeList(): NodeIdentifiersOf<TAppDefinition>[] {
    if (!this.currentNode) {
      return this.getRemoteNodeList();
    }
    return [
      ...this.getRemoteNodeList(),
      this.currentNode as NodeIdentifiersOf<TAppDefinition>,
    ];
  }
  public getRemoteNodeList(): Exclude<
    NodeIdentifiersOf<TAppDefinition>,
    TCurrentNode
  >[] {
    return Object.keys(this.channels) as Exclude<
      NodeIdentifiersOf<TAppDefinition>,
      TCurrentNode
    >[];
  }
  public getModuleNames(): ApisNamesOf<TAppDefinition>[] {
    return Object.keys(this.appDefinition) as ApisNamesOf<TAppDefinition>[];
  }
}
