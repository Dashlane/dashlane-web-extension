import * as React from 'react';
interface AnimatedScoreProps {
    score: number;
}
const FRAMES_PER_SECONDS = 60;
const MILLISECONDS_IN_A_SECOND = 1000;
const FRAMES_INTERVAL_MILLISECONDS = Math.floor(MILLISECONDS_IN_A_SECOND / FRAMES_PER_SECONDS);
const ANIMATION_DURATION_MILLISECONDS = 1000;
const FRAMES_IN_ANIMATION_DURATION = (FRAMES_PER_SECONDS / MILLISECONDS_IN_A_SECOND) *
    ANIMATION_DURATION_MILLISECONDS;
export const AnimatedScore = ({ score }: AnimatedScoreProps) => {
    const timeoutRef = React.useRef<number | null>(null);
    const [currentScore, setCurrentScore] = React.useState(0);
    const [currentScoreIncrementStep, setCurrentScoreIncrementStep] = React.useState(0);
    const resetCurrentScoreAndScoreIncrementStep = React.useCallback(() => {
        setCurrentScore(0);
        setCurrentScoreIncrementStep(score / FRAMES_IN_ANIMATION_DURATION);
    }, [score]);
    const resetTimeout = React.useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = null;
    }, []);
    React.useEffect(() => {
        resetCurrentScoreAndScoreIncrementStep();
    }, [resetCurrentScoreAndScoreIncrementStep]);
    React.useEffect(() => {
        if (currentScore === score) {
            return () => {
                resetTimeout();
            };
        }
        timeoutRef.current = window.setTimeout(() => {
            if (currentScore < score) {
                setCurrentScore((value) => value + currentScoreIncrementStep);
            }
            else {
                resetTimeout();
            }
        }, FRAMES_INTERVAL_MILLISECONDS);
        return () => {
            resetTimeout();
        };
    }, [currentScore, currentScoreIncrementStep, resetTimeout, score]);
    return <>{Math.min(score, Math.ceil(currentScore))}</>;
};
