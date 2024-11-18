import { identity } from "ramda";
import { createSelectorCreator, defaultMemoize } from "reselect";
const areSortTokenEquals = (st1: any, st2: any) =>
  st1.uniqField === st2.uniqField &&
  st1.sortCriteria.length === st2.sortCriteria.length &&
  st1.sortCriteria.every((sc: any, ix: number) =>
    Object.keys(sc).every((k) => sc[k] === st2.sortCriteria[ix][k])
  );
export const createOptimizedSortTokenSelector = createSelectorCreator(
  defaultMemoize,
  areSortTokenEquals
);
const areFilterTokenEquals = (ft1: any, ft2: any) =>
  ft1.filterCriteria.length === ft2.filterCriteria.length &&
  ft1.filterCriteria.every((sc: any, ix: number) =>
    Object.keys(sc).every((k) => sc[k] === ft2.filterCriteria[ix][k])
  );
export const createOptimizedFilterTokenSelector = createSelectorCreator(
  defaultMemoize,
  areFilterTokenEquals
);
const areBatchesEqual = (b1: any, b2: any): boolean =>
  b1.length === b2.length && b1.every((v1: any, ix: number) => b2[ix] === v1);
const createOptimizedBatchSelector = createSelectorCreator(
  defaultMemoize,
  areBatchesEqual
);
export const optimizeBatchSelector = (batchSelector: any) =>
  createOptimizedBatchSelector(batchSelector, identity);
