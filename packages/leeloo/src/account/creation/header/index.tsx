import * as React from 'react';
import classnames from 'classnames';
import { LockupSize } from '@dashlane/ui-components';
import { Link } from 'libs/router';
import { StandardHeader } from 'libs/dashlane-style/standard-header/standard-header';
import styles from './styles.css';
const Header = () => {
    const customClasses = {
        standardHeader: classnames(styles.standardHeader),
        logoContainer: classnames(styles.logoContainer),
        logo: classnames(styles.logo),
        tab: classnames(styles.tab),
    };
    return (<StandardHeader includeLockup classes={customClasses} logoComponent={<Link to="/" target="_blank" rel="noopener noreferrer"/>} lockupSize={LockupSize.Size39}/>);
};
export default React.memo(Header);
