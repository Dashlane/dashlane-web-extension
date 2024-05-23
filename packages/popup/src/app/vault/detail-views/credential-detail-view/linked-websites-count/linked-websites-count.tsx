import * as React from 'react';
import { ChevronRightIcon, colors, jsx } from '@dashlane/ui-components';
import styles from './styles.css';
interface Props {
    linkedWebsitesTitle: string;
    value: string;
    onClick: () => void;
}
const LinkedWebsitesCount: React.FunctionComponent<Props> = ({ linkedWebsitesTitle, value, onClick, }) => {
    return (<button className={styles.container} onClick={onClick} sx={{ color: 'ds.text.neutral.standard' }}>
      <p aria-label={linkedWebsitesTitle} className={styles.value}>
        {value}
      </p>
      <div className={styles.action}>
        <ChevronRightIcon size={12} hoverColor={colors.dashGreen01}/>
      </div>
    </button>);
};
export default React.memo(LinkedWebsitesCount);
