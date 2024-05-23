import * as React from 'react';
import styles from './styles.css';
export interface Props {
    progress: number;
}
const ProgressBar = ({ progress }: Props) => (<div className={styles.container}>
    <div className={styles.progress} style={{ width: `${progress}%` }}/>
    <span className={styles.text}>{Math.floor(progress)}%</span>
  </div>);
export default ProgressBar;
