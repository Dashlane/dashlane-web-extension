import { LocaleFormat } from "./helpers";
import useTranslate from "./useTranslate";
interface Props {
  date: Date;
  format?: LocaleFormat;
  i18n?: {
    key: string;
    param: string;
  };
}
export const LocalizedDateTime = ({
  date,
  format = LocaleFormat.lll,
  i18n,
}: Props) => {
  const { translate } = useTranslate();
  const { shortDate } = translate;
  const formattedDate = shortDate(date, format);
  const i18nFormattedDate = i18n
    ? translate(i18n.key, { [i18n.param]: formattedDate })
    : formattedDate;
  return <time dateTime={date.toISOString()}>{i18nFormattedDate}</time>;
};
