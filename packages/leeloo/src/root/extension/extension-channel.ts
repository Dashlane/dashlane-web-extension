import { Channel, GenericChannel, TransportMessage } from "ts-event-bus";
import { runtimeConnect } from "@dashlane/webextensions-apis";
import { v4 as uuid } from "uuid";
declare let chrome: any;
interface WebExtensionChannelOptions {
  timeout?: number;
}
class WebExtensionChannel extends GenericChannel {
  private _port: chrome.runtime.Port | null = null;
  constructor(options: WebExtensionChannelOptions = {}) {
    super(options.timeout);
    this.setup();
  }
  public autoReconnect(): void {
    this.setup();
  }
  public send(message: {}): void {
    if (!this._port) {
      throw new Error("WebExtensionChannel: no port");
    }
    this._port.postMessage(message);
  }
  private setup(): void {
    const id = uuid();
    this._port = runtimeConnect({
      name: `leeloo-${id}`,
    });
    if (!this._port) {
      return;
    }
    this._port.onMessage.addListener((msg: TransportMessage) =>
      this._messageReceived(msg)
    );
    this._port.onDisconnect.addListener(() => {
      this._port = null;
      this._disconnected();
    });
    this._connected();
  }
}
function getChannelForCurrentEnvironment() {
  if (typeof browser !== "undefined") {
    chrome = browser;
  }
  return new WebExtensionChannel({ timeout: 600000 });
}
const LeelooWebExtChannel: Channel = getChannelForCurrentEnvironment();
export default LeelooWebExtChannel;
