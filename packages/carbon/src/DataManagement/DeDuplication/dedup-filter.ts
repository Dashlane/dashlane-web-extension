import { MergeResult } from "DataManagement/DeDuplication/types";
export type HandshakeRules<T> = {
  [K in keyof Required<T>]: (a: T[K], b: T[K]) => MergeResult<T[K]>;
};
export const merge = <T>(
  item1: T,
  item2: T,
  handshakeRules: HandshakeRules<T>
): MergeResult<T> => {
  const mergedItem: Partial<T> = {};
  const successfulMerge = Object.keys(handshakeRules).every((key) => {
    const mergeResult: MergeResult<T> = handshakeRules[key](
      item1[key],
      item2[key]
    );
    if (mergeResult.success) {
      mergedItem[key] = mergeResult.result;
    }
    return mergeResult.success;
  });
  if (successfulMerge) {
    return {
      success: true,
      result: {
        ...item1,
        ...item2,
        ...mergedItem,
      },
    };
  } else {
    return {
      success: false,
    };
  }
};
export const dedupItems =
  <T>(hashFields: Array<keyof Partial<T>>, handshakeRules: HandshakeRules<T>) =>
  (items: T[]) => {
    const finalItems: T[] = [];
    const hashToItem: {
      string?: T;
    } = {};
    for (const item of items) {
      const hash = hashFields.reduce(
        (acc, field) => `${acc}${item[field]}`,
        ""
      );
      if (hash in hashToItem) {
        const potentialDups: number[] = hashToItem[hash];
        let foundDup = false;
        for (const finalItemsIndex of potentialDups) {
          const potentialDup: T = finalItems[finalItemsIndex];
          const mergeResult: MergeResult<T> = merge(
            item,
            potentialDup,
            handshakeRules
          );
          if (mergeResult.success) {
            finalItems[finalItemsIndex] = mergeResult.result;
            foundDup = true;
            break;
          }
        }
        if (!foundDup) {
          finalItems.push(item);
          potentialDups.push(finalItems.length - 1);
        }
      } else {
        finalItems.push(item);
        hashToItem[hash] = [finalItems.length - 1];
      }
    }
    return finalItems;
  };
