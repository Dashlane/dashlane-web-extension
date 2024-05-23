import { useEffect, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { ScoreGaugeColorTresholds } from '../score-gauge-colors';
const TOTAL_PATH_LENGTH = 394;
const MIN_SCORE = 0;
const MAX_SCORE = 100;
export interface GaugeProps {
    score: number;
    showQueerColors?: boolean;
}
const gaugeColor = (score: number) => {
    if (score < ScoreGaugeColorTresholds.RED_SCORE) {
        return 'ds.border.danger.standard.idle';
    }
    if (score < ScoreGaugeColorTresholds.ORANGE_SCORE) {
        return 'ds.border.warning.standard.idle';
    }
    return 'ds.border.positive.standard.idle';
};
export const Gauge = ({ score, showQueerColors = false }: GaugeProps) => {
    const [currentScore, setCurrentScore] = useState(0);
    const progressLength = (TOTAL_PATH_LENGTH / (MAX_SCORE - MIN_SCORE)) *
        (MAX_SCORE - MIN_SCORE - currentScore);
    useEffect(() => {
        setCurrentScore(score);
    }, [score]);
    return (<svg xmlns="*****" width="200" height="153" fill="none" viewBox="0 0 200 153">
      <mask id="animatedMask">
        <path sx={{ transition: 'stroke-dashoffset 1s ease-in-out' }} strokeDasharray={TOTAL_PATH_LENGTH} strokeDashoffset={progressLength} strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" stroke="white" d="M18.594 147a94 94 0 11162.827-.025"/>
      </mask>
      <path sx={{ stroke: 'ds.border.neutral.quiet.idle' }} strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="M18.594 147a94 94 0 11162.827-.025"/>
      {showQueerColors ? (<g id="queerGroup" mask="url(#animatedMask)">
          <path stroke="#760888" strokeLinecap="round" strokeWidth="12" d="M18.594 147a94 94 0 11162.827-.025"/>
          <path stroke="#014EFF" strokeWidth="12" d="M18.594 147a94 94 0 11175.405-46.614"/>
          <path stroke="#018027" strokeWidth="12" d="M18.594 147a94 94 0 01162.812-94"/>
          <path stroke="#FFEE01" strokeWidth="12" d="M18.594 147A94 94 0 01147.133 18.67"/>
          <path stroke="#FF8D01" strokeWidth="12" d="M18.594 147A93.998 93.998 0 0199.749 6"/>
          <path stroke="#E40404" strokeWidth="12" d="M18.594 147A93.998 93.998 0 0153 18.594"/>
          <path stroke="#795018" strokeWidth="12" d="M18.594 147a93.998 93.998 0 01-.213-93.63"/>
          <path fill="#010101" d="M13.398 150a6 6 0 1010.392-6l-10.392 6zm10.392-6A88 88 0 0112 99.55l-12-.061A99.998 99.998 0 0013.398 150l10.392-6z"/>
        </g>) : (<path sx={{
                stroke: gaugeColor(score),
                transition: 'stroke-dashoffset 1s ease-in-out',
            }} opacity="1" strokeDasharray={TOTAL_PATH_LENGTH} strokeDashoffset={progressLength} strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="M18.594 147a94 94 0 11162.827-.025"/>)}
    </svg>);
};
