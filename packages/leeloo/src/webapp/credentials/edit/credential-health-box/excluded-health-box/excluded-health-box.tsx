import * as React from 'react';
import { Button, Infobox, jsx } from '@dashlane/design-system';
import { CSSTransition } from 'react-transition-group';
import useTranslate from 'libs/i18n/useTranslate';
import transitionStyles from './transition-styles.css';
const TRANSITION_TIME_MS = 600;
const I18N_KEYS = {
    EXCLUDED_TITLE: 'webapp_credential_edition_health_box_excluded_title',
    EXCLUDED_DESCRIPTION: 'webapp_credential_edition_health_box_excluded_description',
    INCLUDE: 'webapp_credential_edition_health_box_include',
};
export interface ExcludedHealthBoxProps {
    onPrimaryClick: () => void;
}
const ExcludedHealthBoxComponent = ({ onPrimaryClick, }: ExcludedHealthBoxProps) => {
    const { translate } = useTranslate();
    const [exiting, setExiting] = React.useState(false);
    const handlePrimaryClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setExiting(true);
    };
    const renderIncludePassword = () => {
        return (<Button mood="brand" intensity="quiet" onClick={handlePrimaryClick} key="primaryAction" size="small" type="button">
        {translate(I18N_KEYS.INCLUDE)}
      </Button>);
    };
    return (<CSSTransition appear in={!exiting} timeout={TRANSITION_TIME_MS} classNames={transitionStyles} onExited={onPrimaryClick}>
      <div sx={{
            backgroundColor: 'ds.background.default',
            marginBottom: '24px',
        }}>
        <Infobox title={translate(I18N_KEYS.EXCLUDED_TITLE)} description={translate(I18N_KEYS.EXCLUDED_DESCRIPTION)} mood="warning" size="large" actions={[renderIncludePassword()]}/>
      </div>
    </CSSTransition>);
};
export const ExcludedHealthBox = React.memo(ExcludedHealthBoxComponent);
