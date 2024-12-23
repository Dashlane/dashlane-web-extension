import { useEffect, useState } from "react";
import { differenceInMilliseconds, formatDistanceToNow } from "date-fns";
import useTranslate from "./useTranslate";
import { LocaleFormat } from "./helpers";
interface Props {
  date: Date;
  i18n?: {
    key: string;
    param: string;
  };
}
const SECOND_IN_MS = 1000;
const TEN_SEC_IN_MS = SECOND_IN_MS * 10;
const MINUTE_IN_MS = SECOND_IN_MS * 60;
const HOUR_IN_MS = MINUTE_IN_MS * 60;
const formatDateStr = (localeMeta?: Locale) => (then: Date) => {
  return {
    friendly: formatDistanceToNow(then, {
      addSuffix: true,
      locale: localeMeta,
    }),
    diffInMs: differenceInMilliseconds(Date.now(), then),
  };
};
const LocalizedTimeAgo = ({ date, i18n }: Props) => {
  const [friendlyAgo, setFriendlyAgo] = useState("");
  const { translate } = useTranslate();
  const { localeMeta, shortDate } = translate;
  useEffect(() => {
    let timeoutId: number | null = null;
    const tick = () => {
      const localeAwareFormatter = formatDateStr(localeMeta);
      const { friendly, diffInMs } = localeAwareFormatter(date);
      const i18nedFriendly = i18n
        ? translate(i18n.key, { [i18n.param]: friendly })
        : friendly;
      setFriendlyAgo(i18nedFriendly);
      const period =
        diffInMs < MINUTE_IN_MS
          ? TEN_SEC_IN_MS
          : diffInMs < HOUR_IN_MS
          ? MINUTE_IN_MS
          : HOUR_IN_MS;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(tick, period);
    };
    tick();
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [localeMeta, date]);
  const nonRelativeDate = localeMeta ? shortDate(date, LocaleFormat.lll) : "";
  return (
    <time dateTime={date.toISOString()} title={nonRelativeDate}>
      {friendlyAgo}
    </time>
  );
};
export default LocalizedTimeAgo;
