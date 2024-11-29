import { carbonEvents } from "./events";
import instance from "./instance";
const carbonConnector = new Proxy(carbonEvents, {
  get: (_target, p: string) => {
    return instance.getCarbonConnector()[p];
  },
});
export { carbonConnector };
