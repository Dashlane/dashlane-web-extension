export const ZXCVBN_MULTIPLYING_FACTOR = 25;
export const ZXCVBN_SCORE_TRANSLATION_MAPPING = {
  0: "zxcvbn_weakest_password",
  1: "zxcvbn_weak_password",
  2: "zxcvbn_acceptable_password",
  3: "zxcvbn_good_password",
  4: "zxcvbn_awesome_password",
};
export type ZXCVBNToPasswordStrengthScore = 0 | 1 | 2 | 3 | 4;
export const isPasswordStrengthScore = (
  arg: number
): arg is ZXCVBNToPasswordStrengthScore => {
  return [0, 1, 2, 3, 4].includes(arg);
};
