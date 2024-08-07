export interface IbanFormatter {
  partsPattern: RegExp | null;
}
export interface ParsedIban {
  full: string;
  compact: string;
  parts: string[];
}
export const FORMATTERS: {
  [locale: string]: IbanFormatter;
} = {
  AL: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  AD: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  AT: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  AZ: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  BE: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  BH: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  BA: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  BG: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  CR: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{1})$/,
  },
  HR: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{1})$/,
  },
  CY: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  CZ: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  DK: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  DO: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  EE: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  FO: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  FI: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  FR: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  GE: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  DE: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  GI: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  GR: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  GL: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  HU: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  IS: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  IE: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  IL: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  IT: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  KZ: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  KW: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  LV: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{1})$/,
  },
  LB: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  LI: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{1})$/,
  },
  LT: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  LU: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  MK: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  MT: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  MR: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  MU: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  MC: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  MD: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  ME: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  NL: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  NO: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  PK: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  PL: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  PT: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{1})$/,
  },
  RO: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  SM: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  SA: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  RS: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  SK: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  SI: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  ES: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  SE: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  CH: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{1})$/,
  },
  TN: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  TR: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  AE: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{3})$/,
  },
  GB: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{2})$/,
  },
  US: {
    partsPattern: /^(\w+)$/,
  },
  VG: {
    partsPattern: /^(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})(\w{4})$/,
  },
  NO_TYPE: {
    partsPattern: null,
  },
};
