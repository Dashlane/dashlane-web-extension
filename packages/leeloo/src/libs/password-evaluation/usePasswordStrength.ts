import { PasswordEvaluationResult } from "@dashlane/communication";
import { useState } from "react";
import {
  isPasswordStrengthScore,
  ZXCVBN_MULTIPLYING_FACTOR,
  ZXCVBNToPasswordStrengthScore,
} from "./helpers";
type PasswordStrength = Pick<PasswordEvaluationResult, "feedback"> & {
  score: ZXCVBNToPasswordStrengthScore;
};
export interface UsePasswordStrength {
  passwordStrength: PasswordStrength | null;
  resetPasswordStrength: () => void;
  setPasswordStrength: (strength: PasswordEvaluationResult) => void;
  isPasswordStrengthScore: (arg: number) => boolean;
  isPasswordStrongEnough: boolean;
}
const MIN_ACCEPTABLE_PASSWORD_STRENGTH = 2;
const checkIsPasswordStrongEnough = (
  passwordStrength: PasswordStrength | null
) => {
  if (!passwordStrength) {
    return false;
  }
  return passwordStrength.score >= MIN_ACCEPTABLE_PASSWORD_STRENGTH;
};
export const usePasswordStrength = (): UsePasswordStrength => {
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength | null>(null);
  const resetPasswordStrength = () => {
    setPasswordStrength(null);
  };
  const updatePasswordStrength = (strength: PasswordEvaluationResult) => {
    const score = (strength.score /
      ZXCVBN_MULTIPLYING_FACTOR) as ZXCVBNToPasswordStrengthScore;
    setPasswordStrength({
      ...strength,
      score,
    });
  };
  const isPasswordStrongEnough = checkIsPasswordStrongEnough(passwordStrength);
  return {
    passwordStrength,
    resetPasswordStrength,
    setPasswordStrength: updatePasswordStrength,
    isPasswordStrengthScore,
    isPasswordStrongEnough,
  };
};
