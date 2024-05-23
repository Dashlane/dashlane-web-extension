import React from 'react';
import classnames from 'classnames';
import useTranslate from 'libs/i18n/useTranslate';
import styleSize from 'webapp/secure-notes/form/style.css';
const I18N_KEYS = {
    TEXT_MAX_SIZE: 'webapp_secure_notes_edition_field_text_max_size_reached',
    TEXT_OVER_LIMIT: 'webapp_secure_notes_edition_field_text_over_limit',
};
interface Props {
    maxAuthorizedSize: number;
    currentSize: number;
}
export const TextMaxSizeReached = ({ maxAuthorizedSize, currentSize, }: Props) => {
    const { translate } = useTranslate();
    const THRESHOLD_WARNING = maxAuthorizedSize * 0.95;
    const THRESHOLD_ALERT = maxAuthorizedSize * 0.995;
    const charLeft = maxAuthorizedSize - currentSize;
    const text = currentSize > maxAuthorizedSize
        ? translate(I18N_KEYS.TEXT_OVER_LIMIT, { overLimit: -charLeft })
        : translate(I18N_KEYS.TEXT_MAX_SIZE, { charLeft: charLeft });
    if (currentSize >= THRESHOLD_WARNING) {
        return (<div className={classnames(styleSize.greyWarningCharLeft, currentSize >= THRESHOLD_ALERT ? styleSize.redWarningCharLeft : {})}>
        {text}
      </div>);
    }
    return null;
};
