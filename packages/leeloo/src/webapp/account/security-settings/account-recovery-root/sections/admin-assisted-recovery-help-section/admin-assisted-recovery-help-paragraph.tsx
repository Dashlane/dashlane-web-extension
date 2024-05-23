import React from 'react';
import styles from './admin-assisted-recovery-help-paragraph.css';
export interface Props {
    content: string;
    header: string;
    number: number;
}
export const AdminAssistedRecoveryHelpParagraph = ({ content, header, number, }: Props) => {
    return (<div className={styles.accountRecoveryHelpSection}>
      <span className={styles.number}>{number}</span>
      <section>
        <h3>{header}</h3>
        <p>{content}</p>
      </section>
    </div>);
};
