const bytes = require("bytes");
export const DISPLAY_SECURE_FILES_QUOTA_WARNING_THRESHOLD = 75 * 1024 * 1024;
export const formatQuota = (remaining: number, max: number) => {
  return {
    usedQuota: bytes(remaining, {
      decimalPlaces: 0,
      unitSeparator: " ",
    }),
    maxQuota: bytes(max, {
      decimalPlaces: 0,
      unitSeparator: " ",
    }),
  };
};
