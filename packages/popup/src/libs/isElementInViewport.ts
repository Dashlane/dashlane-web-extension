export const isElementInViewport = (el: Element) => {
    const rect = el.getBoundingClientRect();
    return (rect.left >= 0 &&
        rect.right <=
            (document.body.clientWidth ||
                window.innerWidth ||
                document.documentElement.clientWidth));
};
