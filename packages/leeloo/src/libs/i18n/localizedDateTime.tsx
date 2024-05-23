import * as React from 'react';
import { LocaleFormat } from 'libs/i18n/helpers';
import useTranslate from 'libs/i18n/useTranslate';
interface Props {
    date: Date;
    format?: LocaleFormat;
}
export const LocalizedDateTime = ({ date, format = LocaleFormat.lll, }: Props) => {
    const { translate } = useTranslate();
    const { shortDate } = translate;
    const formattedDate = shortDate(date, format);
    return <time dateTime={date.toISOString()}>{formattedDate}</time>;
};
