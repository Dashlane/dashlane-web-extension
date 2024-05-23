import * as React from 'react';
import styles from './close-action-labels.css';
export interface Props {
    labels: string[];
    visibleLabel: string;
}
const labelStyle = {
    visibleLabel: {
        opacity: 1,
        top: 0,
        position: 'absolute' as const,
    },
    hiddenLabel: {
        display: 'none',
    },
};
export const CloseActionLabels = ({ labels, visibleLabel }: Props) => {
    return (<div className={styles.container}>
      {labels.map((label) => (<div key={`spacerH_${label}`} className={styles.spacerH}>
          {label}
        </div>))}
      <div className={styles.spacerVContainer}>
        {labels.map((label) => (<div key={`spacerV_${label}`} className={styles.spacerV}>
            {label}
          </div>))}
      </div>
      {labels.map((label) => (<div key={label} style={label === visibleLabel
                ? labelStyle.visibleLabel
                : labelStyle.hiddenLabel}>
          {label}
        </div>))}
    </div>);
};
