export type StrengthName =
  | "tooGuessable"
  | "veryGuessable"
  | "somewhatGuessable"
  | "safelyUnguessable"
  | "veryUnguessable"
  | "none";
const StrengthValues: {
  [key: number]: StrengthName;
} = {
  0: "tooGuessable",
  1: "veryGuessable",
  2: "somewhatGuessable",
  3: "safelyUnguessable",
  4: "veryUnguessable",
};
export function getZxcvbnScoreFrom100BaseStrength(
  strength: number
): 0 | 1 | 2 | 3 | 4 | undefined {
  if (strength >= 4 * 25) {
    return 4;
  }
  if (strength >= 3 * 25) {
    return 3;
  }
  if (strength >= 2 * 25) {
    return 2;
  }
  if (strength >= 1 * 25) {
    return 1;
  }
  if (strength >= 0) {
    return 0;
  }
  return undefined;
}
export function getStrengthName(strength: number): StrengthName {
  const score = getZxcvbnScoreFrom100BaseStrength(strength);
  if (score === undefined) {
    return "none";
  }
  return StrengthValues[score];
}
export function getStrengthI18nKey(strength: number) {
  return `generatePasswordStrength_${getStrengthName(strength)}`;
}
