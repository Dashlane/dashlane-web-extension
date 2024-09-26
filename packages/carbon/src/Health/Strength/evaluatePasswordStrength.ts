import {
  evaluate,
  EvaluatePasswordResult,
  setFrequencyLists,
} from "@dashlane/password-generator";
import {
  PasswordEvaluationRequest,
  PasswordEvaluationResult,
} from "@dashlane/communication";
import { getPublicPath } from "Assets/public-path";
import { CoreServices } from "Services";
import { load } from "Health/Strength/FrequencyLists/frequencyLists";
let _resolve = () => {};
const evaluateReady = new Promise<void>((resolve) => {
  _resolve = resolve;
});
export const loadFrequencyLists = async () => {
  const publicPath = getPublicPath();
  const lists = await load(publicPath);
  setFrequencyLists(lists);
  _resolve();
};
const evaluateHelper = async (
  password: string
): Promise<EvaluatePasswordResult> => {
  await evaluateReady;
  return evaluate(password);
};
export const evaluatePasswordStrength = async (
  password: string
): Promise<number> => {
  const result = await evaluateHelper(password);
  return result.score;
};
export const evaluatePassword = async (
  _: CoreServices,
  params: PasswordEvaluationRequest
): Promise<PasswordEvaluationResult> => {
  const { score, feedback } = await evaluateHelper(params.password);
  return { score, feedback };
};
