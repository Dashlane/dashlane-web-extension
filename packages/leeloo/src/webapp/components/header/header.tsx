import { HTMLAttributes, ReactNode } from 'react';
import classnames from 'classnames';
import { GridContainer, jsx } from '@dashlane/ui-components';
import styles from './styles.css';
interface Props extends HTMLAttributes<HTMLElement> {
    startWidgets?: () => ReactNode;
    endWidget?: ReactNode;
}
export const Header = ({ startWidgets, endWidget, className, ...rest }: Props) => {
    return (<header className={classnames(styles.root, className)} {...rest}>
      <GridContainer gridAutoFlow="column" gap="8px" sx={{ height: '100%', alignItems: 'center' }}>
        {startWidgets ? startWidgets() : null}
      </GridContainer>
      {endWidget ? <div className={styles.endWidget}>{endWidget}</div> : null}
    </header>);
};
