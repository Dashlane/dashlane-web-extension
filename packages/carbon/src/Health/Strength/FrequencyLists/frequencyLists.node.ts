import { readFileSync } from "fs";
export const load = async (path: string) => {
  const res = await readFileSync(`${path}assets/frequency_lists.json`);
  return JSON.parse(res.toString());
};
