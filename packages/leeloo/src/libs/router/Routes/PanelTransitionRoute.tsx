import * as React from 'react';
import classnames from 'classnames';
import { createPortal } from 'react-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { CustomRouteComponentProps, CustomRouteProps } from 'libs/router/types';
import { CommonRoute } from 'libs/router/Routes/CommonRoute';
import cssTransitions from './panel-transition/transition.css';
import cssPanel from '../../../../src/webapp/panel/standard/styles.css';
import styles from './styles.css';
export const PanelTransitionTimeout = 300;
export const Route = (props: CustomRouteProps): JSX.Element => {
    const { component: Component, additionalProps, ...otherRouteProps } = props;
    return (<CommonRoute {...otherRouteProps} stayMounted>
      {(routerProps: CustomRouteComponentProps) => {
            const isOpen = !!routerProps.match;
            const sidePanelRoot = document.getElementById('side-panel-portal');
            if (!sidePanelRoot) {
                return null;
            }
            return createPortal(<>
            {isOpen && <div className={styles.overlay}/>}
            <div className={classnames(cssPanel.parentSlider, {
                    [cssPanel.parentSliderOpen]: isOpen,
                })}>
              <TransitionGroup>
                {isOpen && (<CSSTransition key={routerProps.location.pathname} classNames={cssTransitions} timeout={PanelTransitionTimeout}>
                    {Component ? (<Component {...routerProps} {...additionalProps}/>) : (<div {...routerProps} {...additionalProps}/>)}
                  </CSSTransition>)}
              </TransitionGroup>
            </div>
          </>, sidePanelRoot);
        }}
    </CommonRoute>);
};
export const PanelTransitionRoute = React.memo(Route);
