import { useEffect, useState } from "react";
import { useLocation } from "../../../../libs/router";
import { parse, stringify } from "query-string";
export interface NudgesURLInfo {
  code: string;
}
export const useNudgesInfoFromUrl = (): NudgesURLInfo | undefined => {
  const { search, hash } = useLocation();
  const [info, setInfo] = useState<NudgesURLInfo | undefined>(undefined);
  useEffect(() => {
    const searchObj: {
      code: string | undefined;
    } = parse(search);
    const code = searchObj.code ?? "";
    if (code) {
      delete searchObj.code;
      setInfo((prev) => ({ ...prev, code }));
      const queryString =
        Object.keys(searchObj).length > 0 ? `?${stringify(searchObj)}` : "";
      const urlWithoutParams = window.location.href.split("?")[0];
      window.history.replaceState(
        {},
        "",
        urlWithoutParams + queryString + hash
      );
    }
  }, [search]);
  return info;
};
