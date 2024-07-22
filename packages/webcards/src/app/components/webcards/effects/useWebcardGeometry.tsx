import * as React from "react";
import { SendWebcardGeometryFunction } from "../../../communication/types";
export interface UseWebcardGeometry {
  sendWebcardGeometry: SendWebcardGeometryFunction | null;
}
interface Rect {
  width: number;
  height: number;
}
const parseTransform = (transform: string): number[] => {
  return transform
    .split(/\(|,|\)/)
    .slice(1, -1)
    .map((value: string) => parseFloat(value));
};
const applyTransform = (matrix: number[], { width, height }: Rect) => {
  const transition = matrix && matrix[0];
  if (transition) {
    return {
      width: width / transition,
      height: height / transition,
    };
  }
  return { width, height };
};
const computeFinalRect = (element: HTMLDivElement, geo: Rect): Rect => {
  const styles = window.getComputedStyle(element);
  const matrix = parseTransform(styles.transform || "");
  return applyTransform(matrix, geo);
};
let previousWebcardDiv: HTMLDivElement | null = null;
let previousWidth = 0;
let previousHeight = 0;
export const useWebcardGeometry = ({
  sendWebcardGeometry,
}: UseWebcardGeometry) => {
  const webcardRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!webcardRef.current || !sendWebcardGeometry) {
      return () => {};
    }
    const { current: element } = webcardRef;
    const calculateAndSendSignalGeometry = () => {
      if (element) {
        const geo = element.getBoundingClientRect();
        const finalRect = computeFinalRect(element, geo);
        const width = Math.round(finalRect.width);
        const height = Math.round(finalRect.height);
        if (
          element === previousWebcardDiv &&
          width === previousWidth &&
          height === previousHeight
        ) {
          return;
        }
        previousHeight = height;
        previousWidth = width;
        previousWebcardDiv = element;
        sendWebcardGeometry({
          width,
          height,
        });
      }
    };
    calculateAndSendSignalGeometry();
    const resizeObserver = new ResizeObserver(() => {
      calculateAndSendSignalGeometry();
    });
    resizeObserver.observe(webcardRef.current);
    return () => resizeObserver.disconnect();
  }, [webcardRef, sendWebcardGeometry]);
  return webcardRef;
};
