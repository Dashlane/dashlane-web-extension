export interface MatchPriority {
  getId: () => string;
  getType: () => string;
  getField: () => string;
  getValue: () => number;
  description: string;
}
