export class PortStore {
  private _ports: chrome.runtime.Port[] = [];
  public storePort(port: chrome.runtime.Port): void {
    this._ports.push(port);
  }
  public removePort(port: chrome.runtime.Port): void {
    this._ports = this._ports.filter((aPort) => aPort !== port);
  }
  public getPorts(tabId: number, frameId?: number): chrome.runtime.Port[] {
    return this._ports.filter(
      (port) =>
        port.sender?.tab?.id === tabId &&
        (!frameId || frameId === port.sender.frameId)
    );
  }
}
