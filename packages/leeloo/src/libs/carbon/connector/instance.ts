import { CarbonEvents, carbonEvents } from "./events";
class CarbonConnectorInstance {
  public getCarbonConnector() {
    return this.instance;
  }
  public setCarbonConnector(connector: CarbonEvents) {
    this.instance = connector;
  }
  private instance: CarbonEvents = carbonEvents;
}
const instance = new CarbonConnectorInstance();
export default instance;
