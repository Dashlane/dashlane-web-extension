import leelooConnector from "Connector/CarbonLeelooConnector";
export interface OpenSessionProgressService {
  init: (maxNbJobsTodo: number) => void;
  incrementJobsDone: () => void;
  decrementJobsTodo: () => void;
}
export const makeOpenSessionProgressService =
  (): OpenSessionProgressService => {
    let nbJobsTodo: number;
    let nbJobsDone: number;
    let lastValue: number;
    let lastUpdate: number;
    const sendUpdateToUiIfNecessary = (forceUpdate = false) => {
      const connector = leelooConnector();
      if (!connector) {
        return;
      }
      const currentValue = (nbJobsDone / nbJobsTodo) * 100;
      if (
        forceUpdate ||
        (Date.now() - lastUpdate >= 500 && currentValue !== lastValue)
      ) {
        lastValue = currentValue;
        lastUpdate = Date.now();
        connector.openSessionProgressChanged({
          statusDescription: "percentage of work done before session opening",
          statusProgress: lastValue,
        });
      }
    };
    return {
      init(maxNbJobsTodo: number) {
        nbJobsTodo = maxNbJobsTodo;
        nbJobsDone = 0;
        lastValue = 0;
        lastUpdate = Date.now();
        sendUpdateToUiIfNecessary(true);
      },
      incrementJobsDone() {
        if (nbJobsTodo === undefined) {
          throw new Error(
            "openSessionProgressService must be initialized before begin used"
          );
        }
        nbJobsDone++;
        sendUpdateToUiIfNecessary();
      },
      decrementJobsTodo() {
        nbJobsTodo--;
      },
    };
  };
