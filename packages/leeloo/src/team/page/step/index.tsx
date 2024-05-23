import React from 'react';
import { colors, jsx, Paragraph } from '@dashlane/ui-components';
import styles from './styles.css';
interface Props {
    img: string;
    title: string;
    subtitle: string;
    stepLabel?: string;
    stepNumber?: number;
    caps?: boolean;
    dotStyle?: React.CSSProperties;
}
const Step = ({ img, title, subtitle, stepLabel, stepNumber, caps, dotStyle, }: Props) => (<div className={styles.container}>
    <img src={img} className={styles.img}/>
    <Paragraph size="medium" caps={caps ? true : undefined} sx={{ marginTop: '-43px', marginBottom: '11px' }}>
      {title}
    </Paragraph>
    <Paragraph color={colors.grey00} size="small">
      {subtitle}
    </Paragraph>
    <div className={styles.numberContainer}>
      <div className={styles.dot} style={dotStyle}/>
      {stepLabel && stepNumber ? (<Paragraph size="small" sx={{ textAlign: 'left' }}>
          {stepLabel} {stepNumber}
        </Paragraph>) : null}
    </div>
  </div>);
export default Step;
