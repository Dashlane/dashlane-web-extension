import * as React from 'react';
import classnames from 'classnames';
import styles from './styles.css';
interface ButtonsOnHoverProps {
    children?: React.ReactNode[];
    enabled: boolean;
    disableHover?: boolean;
}
export const ButtonsOnHover: React.FC<ButtonsOnHoverProps> = ({ disableHover = false, ...props }) => {
    const [hovering, setHovering] = React.useState(false);
    const { children: [input, ...buttons] = [] } = props;
    return (<div className={styles.buttonsContainer} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      {input}
      {props.enabled && (<span className={classnames(styles.buttons, {
                [styles.visible]: disableHover || hovering,
            })}>
          {buttons}
        </span>)}
    </div>);
};
