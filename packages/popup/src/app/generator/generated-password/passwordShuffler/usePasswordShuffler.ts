import * as React from 'react';
import { getRandomPassword, replaceCharInWord, } from 'src/app/generator/generated-password/passwordShuffler/helpers';
const INTERVAL_TIME = 10;
const BUFFER_TIME = 150;
interface UsePasswordShuffler {
    shuffledPassword: string;
    isPasswordShuffling: boolean;
}
interface UsePasswordShufflerParams {
    passwordLength: number;
    shouldShuffle: boolean;
}
export function usePasswordShuffler({ shouldShuffle, passwordLength, }: UsePasswordShufflerParams): UsePasswordShuffler {
    const intervalRef = React.useRef<number | null>(null);
    const [shuffledPassword, setShuffledPassword] = React.useState(getRandomPassword(passwordLength));
    const shufflePassword = React.useCallback(() => {
        let randomPassword = replaceCharInWord(shuffledPassword);
        const charAmount = randomPassword.length / 6;
        for (let i = 0; i < charAmount; i++) {
            randomPassword = replaceCharInWord(randomPassword);
        }
        setShuffledPassword(randomPassword);
    }, [shuffledPassword]);
    const [isPasswordShuffling, setIsPasswordShuffling] = React.useState(shouldShuffle);
    React.useEffect(() => {
        if (shouldShuffle) {
            setIsPasswordShuffling(true);
        }
        else {
            window.setTimeout(() => {
                setIsPasswordShuffling(false);
            }, BUFFER_TIME);
        }
    }, [shouldShuffle]);
    React.useEffect(() => {
        if (shuffledPassword.length !== passwordLength) {
            setShuffledPassword(getRandomPassword(passwordLength));
        }
        if (isPasswordShuffling) {
            intervalRef.current = window.setInterval(shufflePassword, INTERVAL_TIME);
        }
        else {
            intervalRef.current && window.clearInterval(intervalRef.current);
        }
        return () => {
            intervalRef.current && window.clearInterval(intervalRef.current);
        };
    }, [isPasswordShuffling, passwordLength, shufflePassword, shuffledPassword]);
    return { shuffledPassword, isPasswordShuffling };
}
