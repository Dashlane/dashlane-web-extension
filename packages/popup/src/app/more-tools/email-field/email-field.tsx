import { useEffect, useRef, useState } from 'react';
import { jsx, Tooltip } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
interface Props {
    login: string;
}
const I18N_KEYS = {
    EMAIL_LABEL_TITLE: 'footer/email_label',
};
export const EmailField = ({ login }: Props) => {
    const { translate } = useTranslate();
    const [isTooltipEnabled, setIsTooltipEnabled] = useState(false);
    const emailElement = useRef<HTMLDivElement>(null);
    const emailField = (<div sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            fontSize: 12,
            lineHeight: 1.6,
            paddingTop: '16px',
            flexShrink: 0,
        }} color="ds.text.neutral.standard" ref={emailElement}>
      <span>{translate(I18N_KEYS.EMAIL_LABEL_TITLE)}</span>{' '}
      <span color="ds.text.neutral.standard" data-testid="email" sx={{
            fontWeight: 600,
        }}>
        {login}
      </span>
    </div>);
    useEffect(() => {
        const { current } = emailElement;
        if (current === null) {
            return;
        }
        const isEllipsisActive = current.offsetWidth < current.scrollWidth;
        setIsTooltipEnabled(isEllipsisActive);
    }, [emailElement]);
    return (<Tooltip passThrough={!isTooltipEnabled} placement="top" content={login}>
      {emailField}
    </Tooltip>);
};
