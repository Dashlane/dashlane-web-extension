import { evaluatePasswordStrength } from "Health/Strength/evaluatePasswordStrength";
export const evaluatePasswordStrengthOutOfFive = async (
  pwd: string
): Promise<number | undefined> => {
  if (!pwd) {
    return undefined;
  }
  return (await evaluatePasswordStrength(pwd)) / 25;
};
