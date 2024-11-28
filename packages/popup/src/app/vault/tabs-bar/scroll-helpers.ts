import { isElementInViewport } from "../../../libs/isElementInViewport";
export type ScrollDirection = "right" | "left";
export const scrollViewportToNextChild = (
  listElement: Element,
  direction: ScrollDirection
) => {
  const childList =
    direction === "right"
      ? [...listElement.children]
      : [...listElement.children].reverse();
  const firstChildInViewportIndex = childList.findIndex(isElementInViewport);
  if (firstChildInViewportIndex !== -1) {
    const childToScrollTo = childList
      .slice(firstChildInViewportIndex + 1)
      .find((child) => !isElementInViewport(child));
    childToScrollTo?.scrollIntoView();
  }
};
