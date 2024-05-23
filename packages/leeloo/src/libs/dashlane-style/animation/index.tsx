import lottie, { AnimationConfigWithData, AnimationEventCallback, AnimationEventName, } from 'lottie-web/build/player/lottie_light';
import React, { useEffect, useRef } from 'react';
export type AnimationParams = Omit<Readonly<AnimationConfigWithData>, 'container'>;
export interface AnimationEventListener {
    eventName: AnimationEventName;
    callback: AnimationEventCallback;
}
export interface AnimationProps {
    animationParams: AnimationParams;
    containerClassName?: string;
    eventListeners?: AnimationEventListener[];
    height?: number;
    width?: number;
}
const Animation = ({ animationParams, containerClassName, eventListeners = [], height, width, }: AnimationProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!containerRef || !containerRef.current) {
            return () => { };
        }
        const animationItem = lottie.loadAnimation({
            ...animationParams,
            container: containerRef.current,
        });
        const addEventListeners = () => {
            eventListeners.forEach(({ eventName, callback }) => {
                animationItem.addEventListener(eventName, callback);
            });
        };
        const removeEventListeners = () => {
            eventListeners.forEach(({ eventName, callback }) => {
                animationItem.removeEventListener(eventName, callback);
            });
        };
        addEventListeners();
        return () => {
            removeEventListeners();
            if (animationItem) {
                animationItem.destroy();
            }
        };
    }, [animationParams, containerRef, eventListeners]);
    return (<div style={{
            height,
            width,
        }} ref={containerRef} className={containerClassName}/>);
};
const MemoizedAnimation = React.memo(Animation);
export default MemoizedAnimation;
