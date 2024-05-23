import React from 'react';
import Animation from '../animation';
import classnames from 'classnames';
import styles from './styles.css';
import darkAnim from './animation-dark.json';
import lightAnim from './animation-light.json';
export interface Props {
    size?: number;
    containerStyle?: React.CSSProperties;
    containerClassName?: string;
    mode?: 'light' | 'dark';
}
const LoadingSpinner = ({ size = 100, containerClassName, containerStyle = {}, mode = 'light', }: Props) => (<div className={classnames(styles.loadingContainer, containerClassName)} style={containerStyle}>
    <Animation height={size} width={size} animationParams={{
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: mode === 'dark' ? darkAnim : lightAnim,
    }}/>
  </div>);
export default LoadingSpinner;
