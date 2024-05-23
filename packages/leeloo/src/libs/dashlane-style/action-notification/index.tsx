import * as React from 'react';
import classnames from 'classnames';
import { Button } from '@dashlane/ui-components';
import styles from './styles.css';
export interface Props {
    title: string | React.ReactNode;
    secondTitle?: string;
    description?: string | React.ReactNode;
    arrowPosition?: 'topRight' | 'topLeft' | 'sideLeft' | 'sideLeftTop' | 'bottomLeft';
    show?: boolean;
    imageSrc?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    onAppear?: () => void;
    onSeen?: () => void;
    style?: React.CSSProperties;
    className?: string;
    mode?: 'dark' | 'light';
}
export const ActionNotification = ({ mode = 'dark', onSeen = () => { }, onAppear = () => { }, ...props }: Props) => {
    React.useEffect(() => {
        onAppear();
        return onSeen;
    }, []);
    return !props.show ? null : (<div className={classnames(styles.container, props.className)}>
      <div className={classnames(styles[mode], styles.notification, {
            [styles.showArrow]: props.arrowPosition,
        }, props.arrowPosition
            ? { [styles[props.arrowPosition]]: props.arrowPosition }
            : {})} style={props.style}>
        <div className={classnames(styles[mode], styles.inner)}>
          <div className={styles.content}>
            <div className={styles.innerContainer}>
              <div>
                <h1 className={classnames(styles[mode], styles.title)}>
                  {props.title}
                  {props.secondTitle && (<div>
                      <br />
                      {props.secondTitle}
                    </div>)}
                </h1>
                {props.description && (<h2 className={classnames(styles[mode], styles.description)}>
                    {props.description}
                  </h2>)}
              </div>
            </div>

            {props.imageSrc && (<img className={styles.image} src={props.imageSrc}/>)}

            {(props.confirmLabel || props.cancelLabel) && (<div className={styles.actions}>
                {props.cancelLabel && props.onCancel && (<Button nature="secondary" type="button" theme={mode} onClick={props.onCancel}>
                    {props.cancelLabel}
                  </Button>)}
                {props.confirmLabel && props.onConfirm && (<Button type="button" className={styles.marginLeft} onClick={props.onConfirm}>
                    {props.confirmLabel}
                  </Button>)}
              </div>)}
          </div>
        </div>
      </div>
    </div>);
};
