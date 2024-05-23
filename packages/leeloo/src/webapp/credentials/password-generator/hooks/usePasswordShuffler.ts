import { useCallback, useEffect, useRef, useState } from 'react';
import { getRandomPassword, replaceCharInWord } from '../helpers';
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
    const intervalRef = useRef<number | null>(null);
    const [shuffledPassword, setShuffledPassword] = useState(getRandomPassword(passwordLength));
    const shufflePassword = useCallback(() => {
        let randomPassword = replaceCharInWord(shuffledPassword);
        const charAmount = randomPassword.length / 6;
        for (let i = 0; i < charAmount; i++) {
            randomPassword = replaceCharInWord(randomPassword);
        }
        setShuffledPassword(randomPassword);
    }, [shuffledPassword]);
    const [isPasswordShuffling, setIsPasswordShuffling] = useState(shouldShuffle);
    useEffect(() => {
        let timeoutId: number;
        if (shouldShuffle) {
            setIsPasswordShuffling(true);
        }
        else {
            timeoutId = window.setTimeout(() => {
                setIsPasswordShuffling(false);
            }, BUFFER_TIME);
        }
        return () => window.clearTimeout(timeoutId);
    }, [shouldShuffle]);
    useEffect(() => {
        if (shuffledPassword.length !== passwordLength) {
            setShuffledPassword(getRandomPassword(passwordLength));
        }
        if (isPasswordShuffling) {
            intervalRef.current = window.setInterval(shufflePassword, INTERVAL_TIME);
        }
        else if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
        };
    }, [isPasswordShuffling, passwordLength, shufflePassword, shuffledPassword]);
    return { shuffledPassword, isPasswordShuffling };
}
