import { MakeFileLocationParams } from "./error.types";
export function makeFileLocation({
  column,
  line,
  name,
}: MakeFileLocationParams) {
  if (!column && !line && !name) {
    return "";
  }
  return `${name}:${line}:${column}`;
}
