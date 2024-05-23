import { PropsWithChildren, useEffect, useRef } from 'react';
import { Button, DSCSSObject, Heading, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import cssVariables from '../../variables.css';
export interface Props {
    headingText: string;
    headingAriaLabelledby?: string;
    onNavigateOut: () => void;
}
const I18N_KEYS = {
    BACK_BUTTON: 'webapp_account_common_panel_back_button',
};
const HEADER_STYLE: DSCSSObject = {
    width: '100%',
    lineHeight: 0,
    display: 'flex',
    padding: '20px 16px',
    alignItems: 'center',
    gap: '4px',
};
const ANIMATION_DURATION_MS = parseInt(cssVariables['--edit-panel-animation-duration-enter'], 10);
export const AccountSubPanel = ({ headingText, headingAriaLabelledby, onNavigateOut, children, }: PropsWithChildren<Props>) => {
    const panelContentList = useRef<HTMLDivElement>(null);
    const { translate } = useTranslate();
    useEffect(() => {
        const postAnimationFocusTimer = setTimeout(() => {
            panelContentList.current?.focus();
        }, ANIMATION_DURATION_MS);
        return () => {
            clearTimeout(postAnimationFocusTimer);
        };
    }, []);
    return (<section sx={{
            display: 'flex',
            height: '100vh',
            flexDirection: 'column',
            width: '360px',
            padding: '0 8px',
        }}>
      <div sx={HEADER_STYLE}>
        <Button mood="neutral" intensity="supershy" layout="iconOnly" icon="ArrowLeftOutlined" onClick={onNavigateOut} aria-label={translate(I18N_KEYS.BACK_BUTTON)}/>
        <Heading as="h2" textStyle="ds.title.section.medium" color="ds.text.neutral.catchy" aria-labelledby={headingAriaLabelledby}>
          {headingText}
        </Heading>
      </div>
      <div sx={{
            flex: 1,
            overflowX: 'hidden',
            msOverflowY: 'auto',
            outline: 0,
        }} ref={panelContentList} tabIndex={-1}>
        {children}
      </div>
    </section>);
};
