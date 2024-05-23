import React from 'react';
import classnames from 'classnames';
import styles from './styles.css';
interface Props {
    onSiteIconClick: (domain: string, loginUrl: string) => void;
    iconUrl: string;
    domain: string;
    loginUrl: string;
}
const SITE_ICON_WIDTH = '97';
const SITE_ICON_HEIGHT = '64';
export const SiteIcon = ({ iconUrl, domain, loginUrl, onSiteIconClick, }: Props) => {
    return (<div className={classnames({
            [styles.dummy]: !loginUrl,
        })}>
      <a className={styles.imageContainer} onClick={() => onSiteIconClick(domain, loginUrl)}>
        <img className={styles.imageSubContainer} src={iconUrl} width={SITE_ICON_WIDTH} height={SITE_ICON_HEIGHT}/>
        <p className={styles.domain}>{domain}</p>
      </a>
    </div>);
};
