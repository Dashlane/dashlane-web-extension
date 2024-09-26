import { logWarn } from "Logs/Debugger/console";
export type Processor<T> = (
  item: T,
  callback: (value: T | null) => void
) => Promise<void>;
export const asyncMapLimit = <T>(
  data: T[],
  processTransaction: Processor<T>,
  resolve: (value: T[]) => void,
  limit: number = data.length
) => {
  const nbToReceive = data.length;
  let completedItem = 0;
  const finalArray: T[] = [];
  let lastIndexVisited = 0;
  const callback = (i: number) => (value: T | null) => {
    finalArray[i] = value;
    completedItem++;
    if (nbToReceive === completedItem) {
      return resolve(finalArray);
    }
    if (lastIndexVisited < nbToReceive - 1) {
      lastIndexVisited++;
      processTransaction(data[lastIndexVisited], callback(lastIndexVisited));
    }
  };
  const concurrentLimit = Math.max(Math.min(nbToReceive, limit), 1);
  lastIndexVisited = concurrentLimit - 1;
  for (let index = 0; index < concurrentLimit; index++) {
    processTransaction(data[index], callback(index)).catch((error: Error) =>
      logWarn({
        message: error.message,
      })
    );
  }
};
