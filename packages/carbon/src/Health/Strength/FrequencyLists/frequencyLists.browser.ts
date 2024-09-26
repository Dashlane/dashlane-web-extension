import { ZXCVBNFrequencyLists } from "@dashlane/password-generator";
import { httpGetUsingFetch } from "Libs/Http/getFetch";
export const load = async (path: string) => {
  const { data } = await httpGetUsingFetch<ZXCVBNFrequencyLists>(
    `${path}assets/frequency_lists.json`
  );
  return data;
};
