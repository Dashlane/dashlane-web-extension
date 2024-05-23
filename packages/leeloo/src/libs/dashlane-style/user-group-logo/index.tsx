import * as React from 'react';
import styles from './styles.css';
import groupIcon from './group-icon.svg';
const UserGroupLogo = () => {
    return (<div className={styles.groupIconWrapper}>
      <img src={groupIcon} className={styles.groupIcon}/>
    </div>);
};
export default UserGroupLogo;
